const { ActivityType } = require("discord.js");

module.exports = (client) => {
  console.log(`${client.user.tag} is online.`);
  let status = [
    {
      name: "MadeByNullButDoNotDMMe",
      type: ActivityType.Custom,
    },
    {
      name: "Hope you enjoy!",
      type: ActivityType.Custom,
    },
    {
      name: "DreamLand Roleplay",
      type: ActivityType.Custom,
    },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 3000);
};
