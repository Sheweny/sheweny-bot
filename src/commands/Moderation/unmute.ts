import { Command, ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";
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
          type: ApplicationCommandOptionType.User,
          description: "The user to unmute",
          required: true,
        },
        {
          name: "reason",
          type: ApplicationCommandOptionType.String,
          description: "The reason of unmute.",
          required: false,
        },
      ],
      userPermissions: ["BanMembers"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const member = interaction.options.getMember("user") as GuildMember;
    const reason =
      (interaction.options.get("reason", false)?.value as string) ||
      "No reason was given";
    if (!member)
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} User not found.`,
        ephemeral: true,
      });

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({
        content: "This user is not muted",
        ephemeral: true,
      });
    }
    member.timeout(null, reason);
    await interaction.reply({
      content: `${member.user.tag} is now unmuted`,
      ephemeral: true,
    });

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.COLORS.GREEN,
      "unmute",
      { reason: reason }
    );
    sendLogChannel(this.client, interaction, { embeds: [embed] });
  }
}
