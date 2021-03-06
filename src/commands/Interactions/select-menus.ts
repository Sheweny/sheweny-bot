import { Command, ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { SelectMenuBuilder, ActionRowBuilder } from "discord.js";

export class PingCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "select-menus",
      description: "Send buttons",
      type: "SLASH_COMMAND",
      category: "Tests",
    });
  }
  execute(interaction: CommandInteraction) {
    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Nothing selected")
        .addOptions([
          {
            label: "First option",
            description: "The first option",
            value: "first_option",
          },
          {
            label: "Second option",
            description: "The second option",
            value: "second_option",
          },
        ])
    );
    interaction.reply({ content: "Test the select-menus", components: [row] });
  }
}
