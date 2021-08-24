import { ApplicationCommand, ShewenyClient } from "sheweny";
import { GuildMember, MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class WarnCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "warn",
        description: "Warn member of the guild",
        type: "CHAT_INPUT",
        options: [
          {
            name: "user",
            type: "USER",
            description: "The user to warn",
            required: true,
          },
          {
            name: "reason",
            description: "The reason of warn",
            type: "STRING",
            required: false,
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
    if (!member) return interaction.replyErrorMessage("User not found.", true);

    const reason: string =
      interaction.options.getString("reason") || "No reason was provided.";

    const dmEmbed = new MessageEmbed()
      .setTitle("Warn")
      .setColor(this.client.colors.orange)
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      )
      .setThumbnail(
        member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      )
      .setDescription(
        `**Action :** Warn\n**Reason :** ${reason}${
          reason.endsWith(".") ? "" : "."
        }\n**Server :** ${interaction.guild!.name}\n**Moderator :** ${
          interaction.user.tag
        }`
      )
      .setTimestamp()
      .setFooter(
        `By : ${interaction.user.tag}`,
        interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      );
    try {
      await member.send({ embeds: [dmEmbed] });
    } catch {
      return interaction.replyErrorMessage("I can't send a message to this user.", true);
    }
    interaction.replySuccessMessage(
      `I have successfully warn the user \`${member.user.tag}\`.`,
      true
    );
  }
}
