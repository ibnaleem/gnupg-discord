import db from './db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Pastebin, PrivacyLevel } from 'pastedeno';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const { connectDB } = db;
dotenv.config();

export const data = new SlashCommandBuilder()
    .setName('get-gpg-key')
    .setDescription('Get a member\'s GPG key.')
    .addUserOption(option =>
        option.setName('member')
            .setDescription('The member whose GPG key you want to retrieve.')
            .setRequired(true)
    );

export const execute = async (interaction) => {
  const cluster = await connectDB();
  const db = cluster.db("gnupg-discord");
  const publicKeyCollection = db.collection("public-keys");
  
  const user = interaction.options.getUser('member');
  const userKey = await publicKeyCollection.findOne({ userId: user.id });
  
  if (!userKey) {
    return interaction.reply({ content: `❌ <@${user.id}> does not have a GPG key set.`, ephemeral: true });
  } else {
      const publicKeyArmored = `${userKey.publicKey}`;

      const hashPwd = crypto.createHash('sha1')
                            .update(publicKeyArmored)
                            .digest('hex');

      const pastebin = new Pastebin({
                      api_dev_key: process.env.PASTEBIN_API_KEY,
                      api_user_name: process.env.PASTEBIN_USERNAME,
                      api_user_password: process.env.PASTEBIN_PASSWORD,
                    });
          

      const paste = await pastebin.createPaste({
                    text: publicKeyArmored,
                    title: hashPwd,
                    format: "javascript",
                    privacy: PrivacyLevel.UNLISTED,
                    });

          
      const embed = new EmbedBuilder({
                        title: `🔑 <@${user.id}>'s GPG Key`,
                        description: `\`\`\`${paste}\`\`\``,
                        timestamp: new Date(),
                        color: 0x00008B,
                      });
          
      await interaction.reply({ content: `<@${interaction.user.id}`, embeds: [embed], ephemeral: true });
  }
}