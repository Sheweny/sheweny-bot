import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class BanCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "ban",
        description: "Ban member from the guild",
        options: [
          {
            name: "user",
            type: "USER",
            description: "The user to ban",
            required: true,
          },
          {
            name: "reason",
            description: "The reason of ban",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        category: "Moderation",
        userPermissions: ["BAN_MEMBERS"],
        clientPermissions: ["BAN_MEMBERS"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    const argReason =
      interaction.options.get("reason")?.value || "No reason was provided.";
    const argUser = interaction.options.get("user")!.value;
    const user = await this.client.util.resolveMember(
      interaction.guild,
      argUser
    );
    if (!user) return interaction.replyErrorMessage(`User not found.`);
    const embed = new MessageEmbed()
      .setAuthor(`${user.username} (${user.id})`)
      .setColor(this.client.colors.red)
      .setDescription(
        `**Action**: ban\n**Reason**: ${argReason}\n**Guild :** ${
          interaction.guild!.name
        }\nModerator : ${interaction.user.username}`
      )
      .setThumbnail(user.user.displayAvatarURL())
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL()
      );
    if (user.bannable) {
      try {
        await user.send({ embeds: [embed] });
      } finally {
        user.ban({ reason: argReason }).then(() => {
          interaction.reply({ embeds: [embed] }).then(() => {
            setTimeout(() => {
              interaction.deleteReply();
            }, 5000);
          });
          const channel = this.client.util.resolveChannel(
            interaction.guild,
            this.client.config.channels.moderation_logs
          );
          if (
            channel &&
            channel.permissionsFor(interaction.guild!.me).has("SEND_MESSAGES")
          )
            channel.send({ embeds: [embed] });
        });
      }
    } else interaction.replyErrorMessage(`I can't ban this user.`);
  }
}
