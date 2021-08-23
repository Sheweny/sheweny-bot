import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class UnmuteCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "unmute",
        description: "Unmute user in the guild",
        options: [
          {
            name: "user",
            type: "STRING",
            description: "The user to unmute",
            required: true,
          },
        ],
      },
      {
        category: "Moderation",
        userPermissions: ["MANAGE_MEMBERS"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    const argUser = interaction.options.get("user")!.value;
    const user = await this.client.util.resolveMember(
      interaction.guild,
      argUser
    );
    if (!user) return interaction.replyErrorMessage(`User not found.`);
    const muteRole = interaction.guild!.roles.cache.find(
      (r) => r.name === "Muted"
    );
    if (!muteRole)
      return interaction.replyErrorMessage(`This user is not muted.`);
    if (!user.roles.cache.has(muteRole.id))
      return interaction.replyErrorMessage(`This user is not muted.`);
    user.roles.remove(muteRole.id);
    interaction.replySuccessMessage(`<@${user.id}> is now unmuted`);
    const embed = new MessageEmbed()
      .setAuthor(
        `${user.user.username} (${user.id})`,
        user.user.displayAvatarURL()
      )
      .setColor(this.client.colors.green)
      .setDescription(`**Action**: unmute`)
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL()
      );
    const channel = this.client.util.resolveChannel(
      interaction.guild,
      this.client.config.channels.moderation_logs
    );
    if (
      channel &&
      channel.permissionsFor(interaction.guild!.me).has("SEND_MESSAGES")
    )
      channel.send({ embeds: [embed] });
  }
}
