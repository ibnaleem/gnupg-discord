const path = require('path');
const databasePath = path.join(__dirname, 'db.js');

const { connectDB } = require(databasePath)
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } = require('discord.js');


const pgpInput = new TextInputBuilder({
    customId: 'public-key',
    label: 'Enter your GPG public key in ASCII format:',
    minLength: 100,
    required: true,
    style: TextInputStyle.Paragraph,
});


const firstActionRow = new ActionRowBuilder().addComponents(pgpInput);

const embed = new EmbedBuilder()
       .setTitle('✅ GPG public key successfully recorded')
        .setTimestamp()
        .setColor('#00FF00')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-gpg-key')
        .setDescription('Set your GPG key so other users can encrypt messages to you.'),
    
        async execute(interaction) {
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
                                ).then(() => interaction.reply({ embeds: [embed] }));
                                
                            } else {
                                publicKeyCollection.insertOne(newDocument)
                                           .then(() => interaction.reply({ embeds: [embed] }));
                            }
                        }));
    },
};