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
    client.on("messageCreate", async (message) => {
      if (
        // message.author.id === process.env.WEBHOOK_ID &&
        message.content.includes("newRegistrationWhitelist")
      ) {
        let discordTag = message.content.slice(
          message.content.indexOf("_") + 1,
          message.content.indexOf(":")
        );
        discordTag = discordTag.toLowerCase();
        if (discordTag.includes("#")) {
          discordTag = discordTag.replace("#", "");
        }
        const gender = message.content.slice(message.content.indexOf(":") + 1);

        let specifyUserDiscordData;
        const checkDiscordData = await discordData.callback(client);
        await checkDiscordData.idDiscordRegistered.find((data) => {
          if (data.includes(discordTag)) {
            specifyUserDiscordData = data;
          }
        });

        if (!specifyUserDiscordData) return;
        const discordId = specifyUserDiscordData.substring(
          0,
          specifyUserDiscordData.indexOf(":")
        );

        // const discordDataGet = await axios.get(
        //   `${process.env.DISCORD_DATA_URI}/search?discordUserName=${discordTag}`
        // );
        // const discordId = discordDataGet.data[0].discordId;

        let userDisplayAvatarURL;
        const userReg = await client.users.fetch(discordId).catch(() => null);
        if (!userReg) userDisplayAvatarURL = process.env.LOGO_LINK;
        else userDisplayAvatarURL = userReg.displayAvatarURL();

        const embed = new EmbedBuilder()
          // .setTitle(`**ĐƠN ĐĂNG KÝ WHITELIST MỚI**`)
          .setAuthor({
            name: `ĐƠN ĐĂNG KÝ WHITELIST MỚI`,
            iconURL: `${process.env.LOGO_LINK}`,
            url: `${process.env.WHITELIST_SHEET_FORM_LINK}`,
          })
          .setDescription("Cư dân đăng kí whitelist")
          .setColor("#CC99FF") // setColor("Random")
          .addFields(
            {
              name: `\_\_Discord:\_\_`,
              value: `<@${discordId}>`,
              inline: true,
            },
            {
              name: `\_\_Discord Tag:\_\_`,
              value: `${discordTag}`,
              inline: true,
            },
            // {
            //   name: `🧠 \_\_Lưu ý:\_\_`,
            //   value: `Có thể sử dụng Discord Tag để kiểm tra trên Google Sheet.\nLuôn copy và kiểm tra lại *\`id-user\`* trước khi sử dụng lệnh.\nSau khi Duyệt hoặc Từ chối, hãy react ✅ | ❎ và đổ màu của hàng chứa người được Duyệt hoặc bị Từ chối trong Google Sheet để những người khác biết.`,
            // },
            // {
            //   name: `❗️ \_\_id-user:\_\_`,
            //   value: `\`\`\`${discordId}\`\`\``,
            // },
            // {
            //   name: `✍️ \_\_Duyệt cư dân:\_\_`,
            //   value: `gõ **\`/duyet\`** và dán mã trên vào ô *\`id-user\`* rồi enter để duyệt cư dân`,
            // },
            // {
            //   name: `✍️ \_\_Từ chối cư dân:\_\_`,
            //   value: `gõ **\`/tuchoi\`** và dán mã trên vào ô *\`id-user\`* rồi enter để từ chối cư dân`,
            // }
            {
              name: `\_\_id-user:\_\_`,
              value: `\`\`\`${discordId}\`\`\``,
            }
          )
          .setThumbnail(`${userDisplayAvatarURL}`)
          .setFooter({
            text: "DreamlandRP",
            iconURL: `${process.env.LOGO_LINK}`,
          })
          .setTimestamp();

        const acceptWhitelistBtn = new ButtonBuilder()
          .setCustomId(`acceptWhitelistBtn_${discordId}`)
          .setLabel("Duyệt cư dân")
          .setStyle(ButtonStyle.Success)
          .setEmoji("1188659876772192317");
        const rejectWhitelistBtn = new ButtonBuilder()
          .setCustomId(`rejectWhitelistBtn_${discordId}`)
          .setLabel("Từ chối cư dân")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("1127741410532143134");

        const row = new ActionRowBuilder().addComponents(
          acceptWhitelistBtn,
          rejectWhitelistBtn
        );

        const reply = await message.reply({
          embeds: [embed],
          components: [row],
        });
        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
        });

        collector.on("collect", async (interaction) => {
          if (interaction.customId.includes("acceptWhitelistBtn")) {
            await interaction.deferReply({ ephemeral: true });

            const targetUser = await interaction.guild.members.fetch(discordId);
            if (!targetUser) {
              await interaction.editReply(
                "That user doesn't exist in this server."
              );
              return;
            }

            const roleFemale = interaction.guild.roles.cache.get(
              process.env.FEMALE_ROLE_ID
            );
            const roleWhitelist = interaction.guild.roles.cache.get(
              process.env.WHITELIST_ROLE_ID
            );
            const roleNoWhitelist = interaction.guild.roles.cache.get(
              process.env.NO_WHITELIST_ROLE_ID
            );
            if (!roleWhitelist) {
              interaction.editReply({
                content: "couldn't find that role",
              });
              return;
            }

            // const hasRole = interaction.member.roles.cache.has(role.id);
            // if (hasRole) {
            //   await interaction.editReply({
            //     content: `<@${discordId}> đã có role whitelist rồi.`,
            //     ephemeral: true,
            //   });
            //   return;
            // }

            await interaction.guild.members.cache
              .get(discordId)
              .roles.add(roleWhitelist);

            await interaction.guild.members.cache
              .get(discordId)
              .roles.remove(roleNoWhitelist);

            if (gender === "female") {
              await interaction.guild.members.cache
                .get(discordId)
                .roles.add(roleFemale);
            }

            const channel = await client.channels.cache.get(
              `${process.env.NOTIFY_USER_REGISTRATION_WHITELIST_CHANNEL}`
            );
            if (!channel) return;

            await channel.send(
              `✅✅✅✅✅\nChúc mừng <@${discordId}> đã trở thành công dân của Dreamland.\nChúc bạn có phút giây vui vẻ tại đây, vui lòng vào kênh <#${process.env.IP_LOGIN_CHANNEL}> để được hướng dẫn vào thành phố.`
            );
            await interaction.editReply(
              `Cư dân đã được duyệt bởi <@${interaction.user.id}>`
            );

            const acceptSuccessBtn = new ButtonBuilder()
              .setCustomId("acceptSuccessBtn")
              .setLabel(
                `Cư dân đã được duyệt bởi ${interaction.user.globalName}`
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji("1188673144345604206")
              .setDisabled(true);
            const completedRow = new ActionRowBuilder().addComponents(
              acceptSuccessBtn
            );

            reply.edit({
              components: [completedRow],
            });
            reply.react("👍");

            return;
          }
          if (interaction.customId.includes("rejectWhitelistBtn")) {
            await interaction.deferReply({ ephemeral: true });

            const targetUser = await interaction.guild.members.fetch(discordId);
            if (!targetUser) {
              await interaction.editReply(
                "That user doesn't exist in this server."
              );
              return;
            }

            // const role = interaction.guild.roles.cache.get(
            //   "1186972595157999636"
            // );
            // if (!role) {
            //   interaction.editReply({
            //     content: "couldn't find that role",
            //   });
            //   return;
            // }

            // const hasRole = interaction.member.roles.cache.has(role.id);
            // if (hasRole) {
            //   await interaction.editReply({
            //     content: `<@${discordId}> đã có role whitelist rồi.`,
            //     ephemeral: true,
            //   });
            //   return;
            // }

            const channel = await client.channels.cache.get(
              `${process.env.NOTIFY_USER_REGISTRATION_WHITELIST_CHANNEL}`
            );
            if (!channel) return;

            await channel.send(
              `❌❌❌❌❌\n<@${discordId}> chưa đạt yêu cầu.\nVui lòng điền lại đơn đăng ký và chú ý hơn trong từng câu trả lời của bạn.`
            );
            await interaction.editReply(
              `Cư dân đã bị từ chối bởi <@${interaction.user.id}>`
            );

            const rejectSuccessBtn = new ButtonBuilder()
              .setCustomId("rejectSuccessBtn")
              .setLabel(`Cư dân bị từ chối bởi ${interaction.user.globalName}`)
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true);
            const completedRow = new ActionRowBuilder().addComponents(
              rejectSuccessBtn
            );

            reply.edit({
              components: [completedRow],
            });
            reply.react("👎");

            return;
          }
        });

        collector.on("end", () => {
          acceptWhitelistBtn.setDisabled(true);
          rejectWhitelistBtn.setDisabled(true);

          reply.edit({
            components: [row],
          });
        });

        return;
      }
    });
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
