const { ApplicationCommandOptionType } = require("discord.js");

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
      await interaction.deferReply({ ephemeral: true });

      const targetUserId = interaction.options.get("id-user").value;
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
        return interaction.editReply("That user doesn't exist in this server.");
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
        return interaction.editReply({ content: "Couldn't find that role." });
      }

      const targetMember = interaction.guild.members.cache.get(targetUserId);

      const hasRole = targetMember.roles.cache.has(
        process.env.WHITELIST_ROLE_ID
      );

      if (hasRole) {
        return interaction.editReply({
          content: `<@${targetUserId}> đã có role whitelist rồi.`,
          ephemeral: true,
        });
      }

      if (targetMember) {
        await targetMember.roles.add(roleWhitelist);
        await targetMember.roles.remove(roleNoWhitelist);
      }

      const notifyChannel = client.channels.cache.get(
        process.env.NOTIFY_USER_REGISTRATION_WHITELIST_CHANNEL
      );

      if (notifyChannel) {
        await notifyChannel.send(
          `✅✅✅✅✅\nChúc mừng <@${targetUserId}> đã trở thành công dân của Dreamland.\nChúc bạn có phút giây vui vẻ tại đây, vui lòng vào kênh <#${process.env.IP_LOGIN_CHANNEL}> để được hướng dẫn vào thành phố.`
        );
      }

      await interaction.editReply(
        `Cư dân đã được duyệt bởi <@${interaction.user.id}>`
      );

      return;
    } catch (error) {
      console.error("duyet Command Error:", error);
    }
  },
};
