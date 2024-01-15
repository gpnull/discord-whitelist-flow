require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");
const process = require("node:process");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

process.on("unhandledRejection", async (reason, promise) => {
  console.log("unhandledRejection at: ", promise, "reason: ", reason);
});
process.on("uncaughtException", (err) => {
  console.log("uncaughtException: ", err);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("uncaughtExceptionMonitor at: ", err, origin);
});

// (async () => {
//   try {
//     mongoose.set("strictQuery", false);
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Connected to DB.");

//     eventHandler(client);
//   } catch (error) {
//     console.log(`Error: ${error}`);
//   }
// })();

eventHandler(client); //remove this if enable mongodb

client.login(process.env.TOKEN);
