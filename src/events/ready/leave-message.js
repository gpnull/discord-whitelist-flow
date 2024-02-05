const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const discordData = require("../../commands/moderations/mod-get-discord-data.js");

module.exports = async (client) => {
  try {
    client.on("guildMemberRemove", async (member) => {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `DREAMLAND TẠM BIỆT`,
          iconURL: `${process.env.LOGO_LINK}`,
        })
        .setColor("#CC99FF")
        .addFields(
          {
            name: `\_\_id-user:\_\_`,
            value: `\`\`\`${member.user.id}\`\`\``,
          },
          {
            name: `\_\_Thông báo:\_\_`,
            value: `<@${member.user.id}> - (**${member.user.globalName}**) đã rời discord`,
          }
        )
        .setTimestamp();

      const channel = await client.channels.cache.get(
        `${process.env.LEAVE_CHANNEL}`
      );
      if (!channel) return;

      await channel.send({ embeds: [embed] });
    });
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
