import { SlashCommandBuilder,EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

const githubButton = new ButtonBuilder()
    .setLabel('🔗 GitHub')
    .setURL("https://github.com/ibnaleem/gnupg-discord")
    .setStyle(ButtonStyle.Link)

const githubButtonRow = new ActionRowBuilder().addComponents(githubButton)

export const data = new SlashCommandBuilder()
        .setName('info')
        .setDescription('Miscellaneous information about me.');

export const execute = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('/info')
    .setDescription("*Disclaimer: Encryption takes place via Discord's API. While I am [open-sourced](https://github.com/ibnaleem/gnupg-discord), please refrain from sending any sensitive information through Discord. When you submit a message, it is transmitted through Discord's API to me, where I encrypt it and then send it to the recipient via the same API. For sensitive data, it's best to run GnuPG on your own device. My goal is to help mobile users or those unfamiliar with the GPG CLI to securely encrypt messages to others, particularly when they don't know the recipient's key.*")
    .setColor("#3498db")
    .addFields(
      { name: '/encrypt', value: "Send an encrypted message to a user. [I do not store this.](https://github.com/ibnaleem/gnupg-discord/blob/main/commands/encrypt.js#L64-L128)" },
      { name: '/set-gpg-key', value: 'Set your GPG key so other users can encrypt messages to you.' },
      { name: '/get-gpg-key [@member]', value: "Get a member's GPG key." },
      { name: '/info', value: 'Miscellaneous information about me.' },
    )
    .setTimestamp();
  await interaction.reply({ embeds: [embed], components: [githubButtonRow]});
}