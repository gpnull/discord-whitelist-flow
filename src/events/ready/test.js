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
      if (message.content.includes("sss")) {
        const exampleEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          // .setTitle("aaaaaaaaaaaaaaaaaa")
          .setURL("https://discord.js.org/")
          .setAuthor({
            name: "bbbbbbbbbbbbbbbbbbbbb",
            iconURL: "https://i.imgur.com/AfFp7pu.png",
            url: "https://discord.js.org",
          })
          .setDescription("cccccccccccccccccc")
          .setThumbnail("https://i.imgur.com/AfFp7pu.png")
          .addFields(
            { name: "Regular field title", value: "Some value here" },
            { name: "\u200B", value: "\u200B" },
            {
              name: "Inline field title",
              value: "Some value here",
              inline: true,
            },
            {
              name: "Inline field title",
              value: "Some value here",
              inline: true,
            }
          )
          .addFields({
            name: "Inline field title",
            value: "Some value here",
            inline: true,
          })
          .setImage("https://i.imgur.com/AfFp7pu.png")
          .setTimestamp()
          .setFooter({
            text: "Some footer text here",
            iconURL: "https://i.imgur.com/AfFp7pu.png",
          });

        message.reply({ embeds: [exampleEmbed] });
      }
    });
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
