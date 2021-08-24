import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class WarnCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "warn",
        description: "Warn member of the guild",
        options: [
          {
            name: "user",
            type: "USER",
            description: "The user to warn",
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
    const member = await this.client.util.resolveMember(
      interaction.guild,
      interaction.options.get("user")!.value
    );
    if (!member) return interaction.replyErrorMessage("User not found.");
    const reason: string =
      (interaction.options.get("reason")?.value as string) ||
      "No reason was provided.";
    const dmEmbed = new MessageEmbed()
      .setTitle("Warn")
      .setColor(this.client.colors.orange)
      .setAuthor(member.user.username, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        `**Action :** Warn\n**Reason :** ${reason}${
          reason.endsWith(".") ? "" : "."
        }\n**Server :** ${interaction.guild!.name}\n**Moderator :** ${
          interaction.user.username
        }`
      )
      .setTimestamp()
      .setFooter(
        `By : ${interaction.user.username}`,
        interaction.user.displayAvatarURL()
      );
    try {
      await member.send({ embeds: [dmEmbed] });
    } catch {
      return interaction.replyErrorMessage(
        "I can't send a message to this user."
      );
    }
    interaction.replySuccessMessage(
      `I have successfully warn the user \`${member.user.tag}\`.`
    );
  }
}
