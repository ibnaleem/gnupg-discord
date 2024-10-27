import { SlashCommandBuilder,EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

 const getLastCommit = async () => {
    return fetch('https://api.github.com/repos/ibnaleem/gnupg-discord/commits?per_page=1')
        .then(res => res.json())
        .then(res => {
            let commit = res[0].sha.toString();
            let url = `https://github.com/ibnaleem/gnupg-discord/commit/${commit}`
            let slicedCommit = commit.slice(0, 7);
            return {url: url, short: slicedCommit};
        })
        .catch(error => {
            console.error('Error fetching commit:', error);
        });
};

const getLastDate = async () => {
    return fetch('https://api.github.com/repos/ibnaleem/gnupg-discord/commits?per_page=1')
        .then(res => res.json())
        .then(res => {
             let dateStr = res[0].commit.committer.date.toString()
             let date = new Date(dateStr);
            return {date: date};
        })
        .catch(error => {
            console.error('Error fetching commit:', error);
        });
};

const extractLastPageNumber = (linkHeader) => {
    const regex = /page=(\d+)>; rel="last"/;
    const match = linkHeader.match(regex);
    return match ? parseInt(match[1], 10) : null;
};

const getCommits = async () => {
    try {
        const response = await fetch('https://api.github.com/repos/ibnaleem/gnupg-discord/commits?sha=main&per_page=1&page=1');
        const linkHeader = response.headers.get('link');
        
        if (linkHeader) {
            const lastPageNumber = extractLastPageNumber(linkHeader);
            console.log('Last page number:', lastPageNumber);
            return {totalCommits: lastPageNumber};
        } else {
            console.log('No link header found.');
        }
    } catch (error) {
        console.error('Error fetching commits:', error);
    }
};

const githubButton = new ButtonBuilder()
    .setLabel('🔗 GitHub')
    .setURL("https://github.com/ibnaleem/gnupg-discord")
    .setStyle(ButtonStyle.Link)

const issuesButton = new ButtonBuilder()
    .setLabel('Issues')
    .setURL("https://github.com/ibnaleem/gnupg-discord/issues")
    .setStyle(ButtonStyle.Link)
    .setEmoji("🐛")

const githubButtonRow = new ActionRowBuilder().addComponents(githubButton, issuesButton)

export const data = new SlashCommandBuilder()
        .setName('info')
        .setDescription('Miscellaneous information about me.');

export const execute = async (interaction) => {
    await interaction.client.guilds.cache;
    await interaction.client.users.cache;
    let guildSize = interaction.client.guilds.cache.size;
    let userSize = interaction.client.users.cache.size;

    const lastCommit = await getLastCommit();
    const lastDate = await getLastDate();
    const commits = await getCommits();

    const embed = new EmbedBuilder()
        .setTitle('/info')
        .setDescription("*Disclaimer: Encryption takes place via Discord's API. While I am [open-sourced](https://github.com/ibnaleem/gnupg-discord), please refrain from sending any sensitive information through Discord. When you submit a message, it is transmitted through Discord's API to me, where I encrypt it and then send it to the recipient via the same API. For sensitive data, it's best to run GnuPG on your own device. My goal is to help mobile users or those unfamiliar with the GPG CLI to securely encrypt messages to others, particularly when they don't know the recipient's key.*")
        .setColor("#3498db")
        .addFields(
            { name: 'creator', value: "<@1110526906106904626>", inline: true },
            { name: 'created on', value: 'Dec 17 2023', inline: true },
            { name: 'number of users', value: `${userSize}`, inline: true },
            { name: 'number of guilds', value: `${guildSize}`, inline: true },
            { name: 'number of commits', value: `${commits?.totalCommits}`, inline: true },
            { name: 'first commit', value: '[c7715e9](https://github.com/ibnaleem/gnupg-discord/commit/c7715e9fa6cb6da035c07bd86cbdcd19239158fc)', inline: true },
            { name: 'last commit', value: `[${lastCommit?.short}](${lastCommit?.url})`, inline: true },
            { name: 'last modified', value: `${lastDate?.date}`, inline: true },
        )
        .setTimestamp()

    await interaction.reply({ embeds: [embed], components: [githubButtonRow] });
};