import { Command, ShewenyClient } from "sheweny";
import { ButtonStyle, CommandInteraction } from "discord.js";
import { ButtonBuilder, ActionRowBuilder } from "discord.js";

export class PingCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "buttons",
      description: "Send buttons",
      type: "SLASH_COMMAND",
      category: "Tests",
    });
  }
  execute(interaction: CommandInteraction) {
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("primary")
          .setLabel("Primary")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("secondary")
          .setLabel("Secondary")
          .setStyle(ButtonStyle.Secondary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("success")
          .setLabel("Success")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("danger")
          .setLabel("Danger")
          .setStyle(ButtonStyle.Danger)
      );
    interaction.reply({ content: "Test the buttons", components: [row] });
  }
}
