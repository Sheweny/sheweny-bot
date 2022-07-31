import { Command, ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel } from "../../utils";

export class KickCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "kick",
      description: "Kick member from the guild",
      type: "SLASH_COMMAND",
      category: "Moderation",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          description: "The user to kick",
          required: true,
        },
        {
          name: "reason",
          description: "The reason of kick",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
      userPermissions: ["KICK_MEMBERS"],
      clientPermissions: ["KICK_MEMBERS"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const member = interaction.options.getMember("user") as GuildMember;
    const reason =
      (interaction.options.get("reason", false)?.value as string) ||
      "No reason was given";
    if (!member)
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} User not found`,
        ephemeral: true,
      });

    if (
      (interaction.member as GuildMember).roles.highest.comparePositionTo(
        member.roles.highest
      ) <= 0
    )
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} You don't have the permission for this`,
        ephemeral: true,
      });

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.COLORS.RED,
      "kick",
      { reason, guild: interaction.guild! }
    );
    if (member.kickable) {
      try {
        await member.send({ embeds: [embed] });
      } finally {
        member.kick(reason).then(() => {
          interaction.reply({
            content: `${member.user.tag} is kicked`,
            ephemeral: true,
          });
          sendLogChannel(this.client, interaction, { embeds: [embed] });
        });
      }
    } else
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} I can't kick this user`,
        ephemeral: true,
      });
  }
}
