import { Command, ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, User } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel } from "../../utils";

export class UnbanCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "unban",
      description: "Unban user in the guild",
      type: "SLASH_COMMAND",
      category: "Moderation",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.String,
          description: "The user to unban",
          required: true,
        },
      ],
      userPermissions: ["ManageGuild"],
      clientPermissions: ["BanMembers"],
    });
  }
  async execute(interaction: CommandInteraction) {
    try {
      const user = (await this.client.util.resolveUser(
        interaction.options.get("user", true).value as string
      )) as User;
      if (!user)
        return interaction.reply({
          content: `${this.client.config.EMOTES.ERROR} User not found.`,
          ephemeral: true,
        });

      await interaction.guild!.members.unban(user);

      const embed = embedMod(
        user,
        interaction.user,
        this.client.config.COLORS.GREEN,
        "unban"
      );
      await interaction.reply({ embeds: [embed], ephemeral: true });

      sendLogChannel(this.client, interaction, { embeds: [embed] });
    } catch (e: any) {
      console.log(e);

      if (e.message.match("Unknown User"))
        return interaction.reply({
          content: `${this.client.config.EMOTES.ERROR} User not found.`,
          ephemeral: true,
        });
      else
        return interaction.reply({
          content: `${this.client.config.EMOTES.ERROR} An error has occurred. Please try again.`,
          ephemeral: true,
        });
    }
  }
}
