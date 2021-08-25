import { ApplicationCommand, ShewenyClient } from "sheweny";
import { GuildMember, MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class BanCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "ban",
        description: "Ban member from the guild",
        type: "CHAT_INPUT",
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
      interaction.options.getString("reason", false) || "No reason was provided.";
    const member = interaction.options.getMember("user", true) as GuildMember;
    if (!member) return interaction.replyErrorMessage(`User not found.`, true);

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} (${member.id})`)
      .setColor(this.client.colors.red)
      .setDescription(
        `**Action**: ban\n**Reason**: ${argReason}\n**Guild :** ${
          interaction.guild!.name
        }\nModerator : ${interaction.user.username}`
      )
      .setThumbnail(
        member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      )
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      );
    if (member.bannable) {
      try {
        await member.send({ embeds: [embed] });
      } finally {
        member.ban({ reason: argReason }).then(async () => {
          await interaction.reply({ embeds: [embed], ephemeral: true });
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
    } else return interaction.replyErrorMessage(`I can't ban this user.`, true);
  }
}
