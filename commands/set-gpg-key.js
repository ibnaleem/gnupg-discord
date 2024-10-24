import path from 'path';
import db from './db.js';
import { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } from 'discord.js';
const { connectDB } = db;

const pgpInput = new TextInputBuilder({
    customId: 'public-key',
    label: 'Enter your GPG public key in ASCII format:',
    minLength: 100,
    required: true,
    style: TextInputStyle.Paragraph,
});


const firstActionRow = new ActionRowBuilder().addComponents(pgpInput);

export const data = new SlashCommandBuilder()
        .setName('set-gpg-key')
        .setDescription('Set your GPG key so other users can encrypt messages to you.');

export const execute = async (interaction) => {

    const modal = new ModalBuilder({
        customId: `pgp-submission-${interaction.user.id}`,
        title: 'Set Public Key',
    });

    const cluster = await connectDB();
    const db = cluster.db("gnupg-discord");
    const publicKeyCollection = db.collection("public-keys");

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const filter = (interaction) => interaction.customId === `pgp-submission-${interaction.user.id}`

    interaction.awaitModalSubmit({ filter, time: 60_000 })
                .then((ModalSubmitInteraction => {
                    const publicKey = ModalSubmitInteraction.fields.getTextInputValue('public-key')
                    
                    newDocument = {
                        userId: interaction.user.id,
                        publicKey: publicKey,
                        timestamp: Date()
                    }

                    const userKey =  publicKeyCollection.findOne({ userId: interaction.user.id });

                    if (userKey) {
                        publicKeyCollection.updateOne(
                            { userId: interaction.user.id },
                            { $set: { publicKey: publicKey, timestamp: new Date() } }
                        ).then(() => interaction.reply({content: "✅ GPG public key successfully recorded", ephemeral: true}));
                        
                    } else {
                        publicKeyCollection.insertOne(newDocument)
                                   .then(() => interaction.reply({content: "✅ GPG public key successfully recorded", ephemeral: true}));
                    }
                }));
}