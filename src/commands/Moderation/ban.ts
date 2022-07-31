import { Command, ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel } from "../../utils";

export class BanCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "ban",
      description: "Ban member from the guild",
      type: "SLASH_COMMAND",
      category: "Moderation",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          description: "The user to ban",
          required: true,
        },
        {
          name: "reason",
          description: "The reason of ban",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
      userPermissions: ["BAN_MEMBERS"],
      clientPermissions: ["BAN_MEMBERS"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const reason =
      (interaction.options.get("reason", false)?.value as string) ||
      "No reason was provided.";
    const member = interaction.options.getMember("user") as GuildMember;
    if (!member)
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} User not found`,
        ephemeral: true,
      });

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.COLORS.RED,
      "ban",
      { reason, guild: interaction.guild! }
    );
    if (member.bannable) {
      try {
        await member.send({ embeds: [embed] });
      } finally {
        member.ban({ reason }).then(async () => {
          await interaction.reply({
            content: `${member.user.tag} is banned`,
            ephemeral: true,
          });
          sendLogChannel(this.client, interaction, { embeds: [embed] });
        });
      }
    } else
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} I can't ban this user`,
        ephemeral: true,
      });
  }
}
