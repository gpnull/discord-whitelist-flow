const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ComponentType,
} = require("discord.js");
require("dotenv").config();
const discordData = require("./mod-get-discord-data.js");
const createDiscordData = require("./mod-create-discord-data.js");

module.exports = {
  name: "create-wl-form",
  description: "Tạo form đăng ký whitelist cho người chơi.",

  callback: async (client, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const channel = await client.channels.cache.get(
        `${process.env.REGISTRATION_WHITELIST_CHANNEL}`
      );
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle("ĐĂNG KÝ WHITELIST - DREAMLAND")
        .setDescription("Chào mừng các quý cư dân đến với Dreamland")
        .setColor("#CC99FF") // setColor("Random")
        .addFields(
          {
            name: `📋 \_\_Đơn đăng kí Whitelist DreamLand:\_\_`,
            value: `• Độ tuổi có thể tham gia: 16+\n• Không được chia sẻ hay hướng dẫn làm đơn cho người chơi khác. Chúng mình sẽ kiểm tra kĩ các đơn có nội dung trùng với nhau.\n• Dành thời gian đọc kỹ câu hỏi và trả lời bằng Tiếng Việt có dấu.\n• Thời gian duyệt Whitelist của bạn sẽ được chúng mình xử lý trong 1 đến 24 giờ.`,
            // inline: true,
          },
          {
            name: `📌 \_\_Lưu ý:\_\_`,
            value: `• Không quan trọng tuổi tác của bạn. Có thể tuổi của bạn sẽ nhỏ hơn 16, bạn vẫn có thể nộp đơn nhưng ý thức chơi của bạn chính là thứ chúng mình quan tâm.\n• Đây là thành phố Roleplay thuần. Những bạn có ý định tham gia thành phố với mục đích nằm ngoài Roleplay, chúng mình không khuyến khích tham gia.\n• Luật Thành phố và Luật Discord sẽ còn thay đổi để phù hợp với từng giai đoạn, bạn hãy chú ý theo dõi thông báo.`,
            // inline: true,
          },
          {
            name: `📜 \_\_Luật discord:\_\_`,
            value:
              "https://discord.com/channels/1067597880833081404/1067597882326253600",
            inline: true,
          },
          {
            name: `📚 \_\_Luật thành phố:\_\_`,
            value:
              "https://discord.com/channels/1067597880833081404/1186165161074098196",
            inline: true,
          },
          {
            name: "✍️ __Cam kết:__",
            value: `Bằng việc nhấn vào \_\_**Tôi đã đọc và đồng ý tuân thủ luật đã đề ra**\_\_ bên dưới, bạn đã chấp thuận và tuân thủ luật của Thành phố và luật của Discord, mọi vi phạm sẽ được xử lý theo quy định.`,
          }
        )
        .setImage(`${process.env.BANNER_LINK}`)
        .setFooter({
          text: "DreamlandRP",
          iconURL: `${process.env.LOGO_LINK}`,
        });

      const acceptRegulationBtn = new ButtonBuilder()
        .setCustomId("acceptRegulationBtn")
        .setLabel("Tôi đã đọc và đồng ý tuân thủ luật đã đề ra")
        .setStyle(ButtonStyle.Primary);
      // .setEmoji("1072794991065301004");

      const row = new ActionRowBuilder().addComponents(acceptRegulationBtn);

      //Collector for acceptRegulationBtn

      const reply = await channel.send({
        embeds: [embed],
        components: [row],
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "acceptRegulationBtn") {
          let discordSaved = false;
          await interaction.deferReply({ ephemeral: true });

          const checkDiscordData = await discordData.callback(client);
          await checkDiscordData.idDiscordRegistered.find((data) => {
            if (data.includes(interaction.user.id)) {
              discordSaved = true;
            }
          });

          if (!discordSaved) {
            await createDiscordData.callback(
              client,
              checkDiscordData.pageDiscordData,
              interaction.user.id,
              interaction.user.username
            );
          }

          const openWhitelistFormBtn = new ButtonBuilder()
            .setLabel("Đăng ký Whitelist")
            .setURL(`${process.env.WHITELIST_FORM_LINK}`)
            .setStyle(ButtonStyle.Link)
            .setEmoji("1127741482791612516");
          const row = new ActionRowBuilder().addComponents(
            openWhitelistFormBtn
          );

          const embed = new EmbedBuilder()
            .setTitle("CHUẨN BỊ TRỞ THÀNH CƯ DÂN DREAMLAND")
            .setDescription("Bước cuối để trở thành cư dân DreamLand:")
            .setColor("#CC99FF")
            .addFields({
              name: "Mời bạn điền thông tin để chuẩn bị trở thành cư dân của DreamLand:",
              value: `\n\_\_**📌 Lưu ý:**\_\_\nLuật Thành phố và Luật Discord sẽ còn thay đổi để phù hợp với từng giai đoạn, bạn hãy chú ý theo dõi thông báo.\n\n\_\_Cảm ơn <@${interaction.user.id}> đã quan tâm tới Dreamland\_\_ 💖`,
            })
            .setFooter({
              text: "DreamlandRP",
              iconURL: `${process.env.LOGO_LINK}`,
            })
            .setThumbnail(`${process.env.LOGO_LINK}`);

          await interaction.editReply({ embeds: [embed], components: [row] });

          return;
        }
      });

      collector.on("end", () => {
        acceptRegulationBtn.setDisabled(true);

        reply.edit({
          components: [row],
        });
      });

      await interaction.editReply("Created");

      return;
    } catch (error) {
      console.log("create-wl-form Error:", error);
    }
  },
};
