import { Command, ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel } from "../../utils";

export class WarnCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "warn",
      description: "Warn member of the guild",
      category: "Moderation",
      type: "SLASH_COMMAND",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          description: "The user to warn",
          required: true,
        },
        {
          name: "reason",
          description: "The reason of warn",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
      userPermissions: ["BanMembers"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const member = interaction.options.getMember("user") as GuildMember;
    if (!member)
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} User not found.`,
        ephemeral: true,
      });

    const reason: string =
      (interaction.options.get("reason", false)?.value as string) ||
      "No reason was provided.";

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.COLORS.ORANGE,
      "warn",
      { reason }
    );
    try {
      await member.send({ embeds: [embed] });
      sendLogChannel(this.client, interaction, { embeds: [embed] });
    } catch {
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} I can't send message to this user`,
        ephemeral: true,
      });
    }
    interaction.reply({
      content: `I have successfully warn ${member.user.tag}`,
      ephemeral: true,
    });
  }
}
