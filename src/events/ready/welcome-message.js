const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    try {
      const discordId = member.user.id;
      const userReg =
        client.users.cache.get(discordId) ||
        (await client.users.fetch(discordId).catch(() => null));
      const userDisplayAvatarURL =
        userReg?.displayAvatarURL() ?? process.env.LOGO_LINK;

      const autoRole = member.guild.roles.cache.get(process.env.AUTO_ROLE_ID);
      if (autoRole) {
        await Promise.all([
          member.guild.members.cache.get(discordId).roles.add(autoRole),
        ]);
      }

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "XIN CHÀO",
          iconURL: process.env.LOGO_LINK,
        })
        .setDescription(`Chào mừng <@${discordId}>.`)
        .setColor("#CC99FF")
        .addFields(
          {
            name: "__Lưu ý:__",
            value: "Role của bot phải cao hơn role được dùng để set tự động.",
          },
          {
            name: "__Lưu ý:__",
            value: `**${member.user.globalName}** vui lòng vào kênh <#${process.env.CHANNEL_1}>.`,
          }
        )
        .setThumbnail(userDisplayAvatarURL)
        .setFooter({
          text: "server name",
          iconURL: process.env.LOGO_LINK,
        })
        .setImage(process.env.BANNER_WELCOME_LINK)
        .setTimestamp();

      const channel = client.channels.cache.get(process.env.WELCOME_CHANNEL);
      if (channel) {
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error(`welcome-message error: ${error}`);
    }
  });
};
