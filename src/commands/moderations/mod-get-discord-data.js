require("dotenv").config();

module.exports = {
  name: "get-discord-data",
  description: "Lấy toàn bộ data discord đã lưu",

  callback: async (client) => {
    let idDiscordRegistered = [];
    let pageDiscordData = 1;

    const channel = client.channels.cache.get(
      `${process.env.USER_DISCORD_DATA_1_CHANNEL}`
    );
    const allMessage = await channel.messages.fetch({ limit: 100 });
    if (allMessage) {
      allMessage.forEach((message) => {
        idDiscordRegistered.push(message.content);
      });
    }

    if (idDiscordRegistered.length >= 100) {
      pageDiscordData = 2;
      const channel2 = client.channels.cache.get(
        `${process.env.USER_DISCORD_DATA_2_CHANNEL}`
      );
      const allMessage2 = await channel2.messages.fetch({ limit: 100 });
      if (allMessage2) {
        allMessage2.forEach((message) => {
          idDiscordRegistered.push(message.content);
        });
      }

      if (idDiscordRegistered.length >= 200) {
        pageDiscordData = 3;
        const channel3 = client.channels.cache.get(
          `${process.env.USER_DISCORD_DATA_3_CHANNEL}`
        );
        const allMessage3 = await channel3.messages.fetch({ limit: 100 });
        if (allMessage3) {
          allMessage3.forEach((message) => {
            idDiscordRegistered.push(message.content);
          });
        }

        if (idDiscordRegistered.length >= 300) {
          pageDiscordData = 4;
          const channel4 = client.channels.cache.get(
            `${process.env.USER_DISCORD_DATA_4_CHANNEL}`
          );
          const allMessage4 = await channel4.messages.fetch({ limit: 100 });
          if (allMessage4) {
            allMessage4.forEach((message) => {
              idDiscordRegistered.push(message.content);
            });
          }

          if (idDiscordRegistered.length >= 400) {
            pageDiscordData = 5;
            const channel5 = client.channels.cache.get(
              `${process.env.USER_DISCORD_DATA_5_CHANNEL}`
            );
            const allMessage5 = await channel5.messages.fetch({
              limit: 100,
            });
            if (allMessage5) {
              allMessage5.forEach((message) => {
                idDiscordRegistered.push(message.content);
              });
            }
          }
        }
      }
    }

    return { idDiscordRegistered, pageDiscordData };
  },
};
