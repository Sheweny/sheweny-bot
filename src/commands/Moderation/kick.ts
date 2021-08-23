import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class KickCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "kick",
        description: "Kick member from the guild",
        options: [
          {
            name: "user",
            type: "STRING",
            description: "The user to kick",
            required: true,
          },
          {
            name: "reason",
            description: "The reason of kick",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        category: "Moderation",
        userPermissions: ["KICK_MEMBERS"],
        clientPermissions: ["KICK_MEMBERS"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    const argUser = interaction.options.get("user")!.value;
    const reason =
      interaction.options.get("reason")?.value || "No reason was given";
    const interactionMember = await this.client.util.resolveMember(
      interaction.guild,
      interaction.user.id
    );
    const user = await this.client.util.resolveMember(
      interaction.guild,
      argUser
    );
    if (!user) return interaction.replyErrorMessage(`User not found.`);
    if (
      interactionMember.roles.highest.comparePositionTo(user.roles.highest) <=
        0 &&
      interaction.guild!.ownerId !== interaction.user.id
    )
      return interaction.replyErrorMessage(
        `You don't have the permission for this.`
      );
    const embed = new MessageEmbed()
      .setAuthor(`${user.user.username} (${user.id})`)
      .setColor(this.client.colors.red)
      .setDescription(`**Action**: kick\n**Reason**: ${reason}`)
      .setThumbnail(user.user.displayAvatarURL())
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL()
      );
    if (user.kickable) {
      try {
        await user.send({ embeds: [embed] });
      } finally {
        user.kick(reason).then(() => {
          interaction.reply({ embeds: [embed] });
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
    }
  }
}
