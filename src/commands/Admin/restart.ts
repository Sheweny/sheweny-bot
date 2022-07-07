import { Command, ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export class RestartCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "restart",
      description: "Restart the bot",
      type: "SLASH_COMMAND",
      category: "Admin",
      adminsOnly: true,
    });
  }
  async execute(interaction: CommandInteraction) {
    await this.client.managers.commands!.deleteAllCommands(
      "877090306103840778"
    );
    await interaction.reply(`${this.client.config.EMOTES.SUCCESS}Success`);
    return process.exit();
  }
}
