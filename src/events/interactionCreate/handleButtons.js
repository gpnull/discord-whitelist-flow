const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const discordData = require("../../commands/moderations/mod-get-discord-data.js");
const createDiscordData = require("../../commands/moderations/mod-create-discord-data.js");

module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "acceptRegulationBtn-old") {
      try {
        if (!interaction.isButton()) return;
        await interaction.deferReply({ ephemeral: true });

        const checkDiscordData = await discordData.callback(
          client,
          interaction.user.id,
          interaction.user.username
        );

        if (!checkDiscordData.discordSaved) {
          await createDiscordData.callback(
            client,
            checkDiscordData.pageDiscordData,
            interaction.user.id,
            interaction.user.username
          );
        }

        // const discordGet = await axios.get(
        //   `${process.env.DISCORD_DATA_URI}/search?discordId=${interaction.user.id}`
        // );
        // let dataDiscordGet = discordGet.data;

        // if (!dataDiscordGet) {
        //   await axios.post(`${process.env.DISCORD_DATA_URI}`, {
        //     data: {
        //       discordId: `${interaction.user.id}`,
        //       discordUserName: `${interaction.user.username}`,
        //       discordGlobalName: `${interaction.user.globalName}`,
        //     },
        //   });
        // }

        const openWhitelistFormBtn = new ButtonBuilder()
          .setLabel("Đăng ký Whitelist")
          .setURL(
            "https://docs.google.com/forms/d/e/1FAIpQLScu5P-7bel255NYqeIL-8RCHDg8pqM4Opx4o5GbZqddh391pQ/viewform?usp=sf_link"
          )
          .setStyle(ButtonStyle.Link);
        // .setEmoji("1072794991065301004");
        const row = new ActionRowBuilder().addComponents(openWhitelistFormBtn);

        const embed = new EmbedBuilder()
          .setTitle("CHUẨN BỊ TRỞ THÀNH CƯ DÂN DREAMLAND")
          .setDescription(`Bước cuối để trở thành cư dân DreamLand:`)
          .setColor("#CC99FF")
          .addFields({
            name: "Mời bạn điền thông tin để chuẩn bị trở thành cư dân của DreamLand:",
            value: `\n***Lưu ý:*** Luật Discord và Luật Thành phố có thể sẽ còn thay đổi để phù hợp với từng thời điểm, cư dân vui lòng luôn theo dõi thông báo.\nCảm ơn <@${interaction.user.id}> đã quan tâm tới Dreamland 🥹`,
          });

        await interaction.editReply({ embeds: [embed], components: [row] });
        return;
      } catch (error) {
        console.log("acceptRegulationBtn Error: ", error);
      }
    }
  });
};
