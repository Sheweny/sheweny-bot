import { ApplicationCommand, ShewenyClient } from "sheweny";
import { GuildMember, MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class KickCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "kick",
        description: "Kick member from the guild",
        type: "CHAT_INPUT",
        options: [
          {
            name: "user",
            type: "USER",
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
    const member = interaction.options.getMember("user", true) as GuildMember;
    const reason =
      interaction.options.getString("reason", false) || "No reason was given";
    if (!member) return interaction.replyErrorMessage(`User not found.`, true);
    if (
      (interaction.member as GuildMember).roles.highest.comparePositionTo(
        member.roles.highest
      ) <= 0 &&
      interaction.guild!.ownerId !== interaction.user.id
    )
      return interaction.replyErrorMessage(`You don't have the permission for this.`, true);
    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} (${member.id})`)
      .setColor(this.client.colors.red)
      .setDescription(
        `**Action**: kick\n**Reason**: ${reason}\n**Guild**: ${interaction.guild!.name}`
      )
      .setThumbnail(
        member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      )
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      );
    if (member.kickable) {
      try {
        await member.send({ embeds: [embed] });
      } finally {
        member.kick(reason).then(() => {
          interaction.reply({ embeds: [embed], ephemeral: true });
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
