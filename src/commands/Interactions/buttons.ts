import { Command, ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { MessageButton, MessageActionRow } from "discord.js";

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
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("primary")
          .setLabel("Primary")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("secondary")
          .setLabel("Secondary")
          .setStyle("SECONDARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("success")
          .setLabel("Success")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("danger")
          .setLabel("Danger")
          .setStyle("DANGER")
      );
    interaction.reply({ content: "Test the buttons", components: [row] });
  }
}
