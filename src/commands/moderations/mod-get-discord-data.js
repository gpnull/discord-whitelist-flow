require("dotenv").config();

module.exports = {
  name: "get-discord-data",
  description: "Lấy toàn bộ data discord đã lưu",

  callback: async (client) => {
    let idDiscordRegistered = [];
    let pageDiscordData = 1;

    const fetchMessages = async (channelId, limit) => {
      const channel = client.channels.cache.get(`${channelId}`);
      const allMessages = await channel.messages.fetch({ limit });
      if (allMessages) {
        allMessages.forEach((message) => {
          idDiscordRegistered.push(message.content);
        });
      }
    };

    for (let i = 1; i <= 10; i++) {
      const channelKey = `USER_DISCORD_DATA_${i}_CHANNEL`;
      const channelLimit = 100;

      await fetchMessages(process.env[channelKey], channelLimit);

      if (idDiscordRegistered.length >= i * channelLimit) {
        pageDiscordData = i + 1;
      } else {
        break;
      }
    }

    return { idDiscordRegistered, pageDiscordData };
  },
};
