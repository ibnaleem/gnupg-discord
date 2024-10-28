import db from './db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import paste from './paste.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const { connectDB } = db;
const { createPaste } = paste;
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
                            .digest('hex')
                          

      const paste = await createPaste(hashPwd, publicKeyArmored)
          
  
      const embed = new EmbedBuilder({
                        title: `🔑 ${user.username}'s GPG Key`,
                        description: `\`\`\`https://paste.lcomrade.su/${paste.id}\`\`\``,
                        timestamp: new Date(),
                        color: 0x3498db,
                        thumbnail: {
                          url: user.avatarURL() || null,
                        }
                      });
          
      await interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [embed], ephemeral: true });
  }
}
