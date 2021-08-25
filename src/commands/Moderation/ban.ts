import { ApplicationCommand, ShewenyClient } from "sheweny";
import { GuildMember } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel } from "../../utils";

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
    const reason =
      interaction.options.getString("reason", false) || "No reason was provided.";
    const member = interaction.options.getMember("user", true) as GuildMember;
    if (!member)
      return interaction.reply({
        content: `${this.client.config.emojis.error} User not found`,
        ephemeral: true,
      });

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.colors.red,
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
        content: `${this.client.config.emojis.error} I can't ban this user`,
        ephemeral: true,
      });
  }
}
