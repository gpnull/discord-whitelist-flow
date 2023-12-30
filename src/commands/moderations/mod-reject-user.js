const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "tuchoi",
  description: "Dán mã id-user (vd: 112233445566778899) để Từ chối cư dân",
  options: [
    {
      name: "id-user",
      description: "Dán mã id-user (vd: 112233445566778899) để Từ chối cư dân",
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

      // const hasRole = interaction.member.roles.cache.has(role.id);
      // if (hasRole) {
      //   await interaction.editReply({
      //     content: `<@${targetUserId}> đã có role whitelist rồi.`,
      //     ephemeral: true,
      //   });
      //   return;
      // }

      const channel = await client.channels.cache.get(
        `${process.env.NOTIFY_USER_REGISTRATION_WHITELIST_CHANNEL}`
      );
      if (!channel) return;

      await channel.send(
        `<@${targetUserId}> chưa đạt yêu cầu.\nVui lòng điền lại form và chú ý hơn trong từng câu trả lời của bạn.`
      );
      await interaction.editReply(
        `Cư dân đã bị từ chối bởi <@${interaction.user.id}>`
      );

      return;
    } catch (error) {
      console.log(error);
    }
  },
};
