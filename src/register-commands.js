require("dotenv").config();
const {
  REST,
  Routes,
  ApplicationCommandOptionType,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const commands = [];
const commandsData = [
  new ContextMenuCommandBuilder()
    .setName("message info")
    .setType(ApplicationCommandType.Message),
];

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("Slash commands were registered successfully!");

    // console.log("Refreshing context menu commands...");
    // await rest.put(Routes.applicationCommand(process.env.CLIENT_ID), {
    //   body: commandsData,
    // });
    // console.log("Successfully registered context menu commands!");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
