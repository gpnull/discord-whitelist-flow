const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const discordData = require("../../commands/moderations/mod-get-discord-data.js");

module.exports = async (client) => {
  try {
    client.on("guildMemberAdd", async (member) => {
      const discordId = member.user.id;
      let userDisplayAvatarURL;
      const userReg = await client.users.fetch(discordId).catch(() => null);
      if (!userReg) userDisplayAvatarURL = process.env.LOGO_LINK;
      else userDisplayAvatarURL = userReg.displayAvatarURL();

      const roleNoWhitelist = member.guild.roles.cache.get(
        process.env.NO_WHITELIST_ROLE_ID
      );
      await member.guild.members.cache
        .get(discordId)
        .roles.add(roleNoWhitelist);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `DREAMLAND XIN CHÀO`,
          iconURL: `${process.env.LOGO_LINK}`,
        })
        .setDescription(
          `Chào mừng <@${discordId}> đã đến với Dreamland, chúc bạn có một trải nghiệm thật tốt khi ở đây.`
        )
        .setColor("#CC99FF")
        .addFields(
          {
            name: `\_\_Lưu ý:\_\_`,
            value:
              "Vui lòng đọc kỹ luật của Thành phố và luật của Discord, mọi thắc mắc về các bộ luật vui lòng liên hệ hỗ trợ để được giải đáp.",
          },
          // {
          //   name: `📜 \_\_Luật discord:\_\_`,
          //   value:
          //     "https://discord.com/channels/1067597880833081404/1067597882326253600",
          //   inline: true,
          // },
          // {
          //   name: `📚 \_\_Luật thành phố:\_\_`,
          //   value:
          //     "https://discord.com/channels/1067597880833081404/1186165161074098196",

          //   inline: true,
          // },
          {
            name: `\_\_Đăng ký nhập cư:\_\_`,
            value: `Vui lòng vào kênh <#${process.env.REGISTRATION_WHITELIST_CHANNEL}> để thực hiện đăng ký nhập cư.`,
          }
        )
        .setThumbnail(`${userDisplayAvatarURL}`)
        .setFooter({
          text: "DreamlandRP",
          iconURL: `${process.env.LOGO_LINK}`,
        })
        .setImage(`${process.env.BANNER_WELCOME_LINK}`)
        .setTimestamp();

      const channel = await client.channels.cache.get(
        `${process.env.WELCOME_CHANNEL}`
      );
      if (!channel) return;

      await channel.send({ embeds: [embed] });
    });
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
