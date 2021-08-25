import { ApplicationCommand, ShewenyClient } from "sheweny";
import { GuildMember, MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class UnmuteCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "unmute",
        description: "Unmute user in the guild",
        type: "CHAT_INPUT",
        options: [
          {
            name: "user",
            type: "USER",
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
    const member = interaction.options.getMember("user") as GuildMember;
    if (!member) return interaction.replyErrorMessage(`User not found.`, true);

    const muteRole = interaction.guild!.roles.cache.find((r) => r.name === "Muted");
    if (!muteRole) return interaction.replyErrorMessage(`No mute role.`, true);
    if (!member.roles.cache.has(muteRole.id))
      return interaction.replyErrorMessage(`This user is not muted.`, true);

    member.roles.remove(muteRole.id);
    await interaction.replySuccessMessage(`<@${member.id}> is now unmuted`);

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 }))
      .setColor(this.client.colors.green)
      .setDescription(`**Action**: unmute`)
      .setTimestamp()
      .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 }));
    const channel = this.client.util.resolveChannel(
      interaction.guild,
      this.client.config.channels.moderation_logs
    );
    if (channel && channel.permissionsFor(interaction.guild!.me).has("SEND_MESSAGES"))
      channel.send({ embeds: [embed] });
  }
}
