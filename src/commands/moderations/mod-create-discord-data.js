require("dotenv").config();

module.exports = {
  name: "create-discord-data",
  description: "Thêm vào data discord",

  callback: async (
    client,
    discordPage,
    interactionUserId,
    interactionUserName
  ) => {
    const channelDiscordData = client.channels.cache.get(
      process.env[`USER_DISCORD_DATA_${discordPage}_CHANNEL`]
    );

    if (channelDiscordData) {
      await channelDiscordData.send(
        `${interactionUserId}:${interactionUserName}`
      );
    }
  },
};
