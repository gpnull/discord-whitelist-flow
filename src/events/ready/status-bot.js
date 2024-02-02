const { ActivityType } = require("discord.js");

module.exports = (client) => {
  console.log(`${client.user.tag} is online.`);
  let status = [
    {
      name: "MadeByNullButDoNotDMMe",
      type: ActivityType.Custom,
    },
    {
      name: "Roleplay",
      type: ActivityType.Playing,
    },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 3000);
};
