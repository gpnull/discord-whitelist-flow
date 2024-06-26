const { ApplicationCommandOptionType } = require("discord.js");

const channelId = "1067597881814552670";

module.exports = {
  name: "duyet",
  description: "Dán mã id-user (vd: 112233445566778899) để Duyệt cư dân",
  options: [
    {
      name: "id-user",
      description: "Dán mã id-user (vd: 112233445566778899) để Duyệt cư dân",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const targetUserId = interaction.options.get("id-user").value;
      const targetUser = await interaction.guild.members.fetch(targetUserId);
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
      // if (targetUser.id === interaction.guild.ownerId) {
      //   await interaction.editReply(
      //     "You can't set role for user because they're the server owner."
      //   );
      //   return;
      // }

      const roleWhitelist = interaction.guild.roles.cache.get(
        process.env.WHITELIST_ROLE_ID
      );
      const roleNoWhitelist = interaction.guild.roles.cache.get(
        process.env.NO_WHITELIST_ROLE_ID
      );
      if (!roleWhitelist) {
        interaction.editReply({
          content: "couldn't find that role",
        });
        return;
      }

      const hasRole = interaction.member.roles.cache.has(
        `${process.env.WHITELIST_ROLE_ID}`
      );
      if (hasRole) {
        await interaction.editReply({
          content: `<@${targetUserId}> đã có role whitelist rồi.`,
          ephemeral: true,
        });
        return;
      }

      await interaction.guild.members.cache
        .get(targetUserId)
        .roles.add(roleWhitelist);
      await interaction.guild.members.cache
        .get(targetUserId)
        .roles.remove(roleNoWhitelist);

      const channel = await client.channels.cache.get(
        `${process.env.NOTIFY_USER_REGISTRATION_WHITELIST_CHANNEL}`
      );
      if (!channel) return;

      await channel.send(
        `✅✅✅✅✅\nChúc mừng <@${targetUserId}> đã trở thành công dân của Dreamland.\nChúc bạn có phút giây vui vẻ tại đây, vui lòng vào kênh <#${channelId}> để được hướng dẫn vào thành phố.`
      );
      await interaction.editReply(
        `Cư dân đã được duyệt bởi <@${interaction.user.id}>`
      );

      return;
    } catch (error) {
      console.log(error);
    }
  },
};
