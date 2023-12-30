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
    let channelDiscordData;

    if (Number(discordPage) === 1) {
      channelDiscordData = client.channels.cache.get(
        `${process.env.USER_DISCORD_DATA_1_CHANNEL}`
      );
    }
    if (Number(discordPage) === 2) {
      channelDiscordData = client.channels.cache.get(
        `${process.env.USER_DISCORD_DATA_2_CHANNEL}`
      );
    }
    if (Number(discordPage) === 3) {
      channelDiscordData = client.channels.cache.get(
        `${process.env.USER_DISCORD_DATA_3_CHANNEL}`
      );
    }
    if (Number(discordPage) === 4) {
      channelDiscordData = client.channels.cache.get(
        `${process.env.USER_DISCORD_DATA_4_CHANNEL}`
      );
    }
    if (Number(discordPage) === 5) {
      channelDiscordData = client.channels.cache.get(
        `${process.env.USER_DISCORD_DATA_5_CHANNEL}`
      );
    }

    await channelDiscordData.send(
      `${interactionUserId}:${interactionUserName}`
    );
    return;
  },
};
