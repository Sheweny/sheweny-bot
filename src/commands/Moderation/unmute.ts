import { Command, ShewenyClient } from "sheweny";
import { GuildMember } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel } from "../../utils";

export class UnmuteCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "unmute",
      description: "Unmute user in the guild",
      type: "SLASH_COMMAND",
      category: "Moderation",
      options: [
        {
          name: "user",
          type: "USER",
          description: "The user to unmute",
          required: true,
        },
        {
          name: 'reason',
          type: "STRING",
          description: "The reason of unmute.",
          required: false
        }
      ],
      userPermissions: ["BAN_MEMBERS"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const member = interaction.options.getMember("user") as GuildMember;
    const reason = interaction.options.getString("reason", false) || "No reason was given"
    if (!member)
      return interaction.reply({
        content: `${this.client.config.emojis.error} User not found.`,
        ephemeral: true,
      });

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({ content: "// TODO : add message error", ephemeral: true })
    }
    member.timeout(null, reason)
    await interaction.reply({
      content: `${member.user.tag} is now unmuted`,
      ephemeral: true,
    });

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.colors.green,
      "unmute",
      { reason: reason }
    );
    sendLogChannel(this.client, interaction, { embeds: [embed] });
  }
}
