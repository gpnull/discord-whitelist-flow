const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = async (client) => {
  try {
    client.on("guildMemberRemove", async (member) => {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `TẠM BIỆT`,
          iconURL: `${process.env.LOGO_LINK}`,
        })
        .setColor("#CC99FF")
        .addFields({
          name: `\_\_Thông báo:\_\_`,
          value: `<@${member.user.id}> - (**${member.user.globalName}**) đã rời discord`,
        })
        .setTimestamp();

      const channel = await client.channels.cache.get(
        `${process.env.LEAVE_CHANNEL}`
      );
      if (!channel) return;

      await channel.send({ embeds: [embed] });
    });
  } catch (error) {
    console.log(`leave-message error: ${error}`);
  }
};
