require("dotenv").config();

const config = {
  testServer: `${process.env.GUILD_ID}`,
  clientId: `${process.env.CLIENT_ID}`,
  devs: ["252435602383962113"],
};
module.exports = { config };
