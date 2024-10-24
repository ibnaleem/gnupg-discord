import db from './db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import openpgp from 'openpgp';
import paste from './paste.js';
import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
} from 'discord.js';
dotenv.config();
const { connectDB } = db;
const { createPaste } = paste

export const data = new SlashCommandBuilder()
        .setName('encrypt')
        .setDescription('Send an encrypted message to a user');

export const execute = async (interaction) => {
    const userIdField = new TextInputBuilder({
        customId: 'user-id-field',
        label: "Discord ID",
        placeholder: 'E.g 1110526906106904626',
        style: TextInputStyle.Short,
        required: true,
    });
    
    const messageField = new TextInputBuilder({
        customId: 'message-field',
        label: 'Message',
        placeholder: "Disclaimer: Encryption occurs via the Discord API",
        style: TextInputStyle.Paragraph,
        minLength: 1,
        required: true,
    });
    
    const firstActionRow = new ActionRowBuilder().addComponents(userIdField);
    const secondActionRow = new ActionRowBuilder().addComponents(messageField);
    
    const modal = new ModalBuilder({
        customId: `userid-submission-${interaction.user.id}`,
        title: 'Encrypt your message to a user',
    });

    const cluster = await connectDB();
    const db = cluster.db("gnupg-discord");
    const publicKeyCollection = db.collection("public-keys");

    modal.addComponents(firstActionRow);
    modal.addComponents(secondActionRow);
    try {
        await interaction.showModal(modal);
    } catch (error) {
        interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        console.error(error);
        return;
    }

    const filter = (i) => i.customId === `userid-submission-${interaction.user.id}`;
    
    interaction.awaitModalSubmit({ filter, time: 60_000 })
        .then(async (modalSubmitInteraction) => {
            const userId = modalSubmitInteraction.fields.getTextInputValue('user-id-field');
            const message = modalSubmitInteraction.fields.getTextInputValue('message-field');

            const userKey = await publicKeyCollection.findOne({ userId: userId });

            if (userKey) {
                const publicKeyArmored = `${userKey.publicKey}`;
                const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

                const encrypted = await openpgp.encrypt({
                    message: await openpgp.createMessage({ text: message }),
                    encryptionKeys: publicKey,
                });

                if (!encrypted) {
                    throw new Error('Encryption failed; encrypted message is undefined.');
                }

                const hashPwd = crypto.createHash('sha1')
                                      .update(encrypted)
                                      .digest('hex')

                const paste = await createPaste(hashPwd, encrypted)

                const encryptedEmbed = new EmbedBuilder({
                    title: `🔒 New Encrypted Message from ${interaction.user.username}!`,
                    description: `\`\`\`https://paste.lcomrade.su/${paste.id}\`\`\``,
                    timestamp: new Date(),
                    color: 0x3498db,
                    thumbnail: {
                        url: interaction.user.avatarURL() || null,
                    }
                });

                await interaction.followUp({ content: `✅ Your message was successfully sent to <@${userId}>`, ephemeral: true });

                try {
                    const interactionGuildMember = await interaction.guild.members.fetch(userId);
                    await interactionGuildMember.send({ embeds: [encryptedEmbed] });
                } catch (e) {
                    await interaction.reply({ content: `✅ Your message was successfully sent to <@${userId}>`, ephemeral: true });
                    await interaction.followUp({ content: `<@${userId}>`, embeds: [encryptedEmbed] });
                }

            } else {
                const interactionGuildMember = await interaction.guild.members.fetch(userId);
                await interactionGuildMember.send({ content: `⚠️ <@${interaction.user.id}> attempted to send you an encrypted message, but you don't have a GPG key set up for receiving encrypted messages. Please use the **/set-gpg-key** command to configure it.`, ephemeral: true });
                await interaction.reply({ content: `❌ <@${userId}> has not set a GPG key with **/set-gpg-key.** I've reminded them to do so.`, ephemeral: true });
            }
        })
        .catch((error) => {
            console.error('Error waiting for modal submit:', error);
            interaction.followUp({ content: 'You did not respond in time!', ephemeral: true });
        });
}