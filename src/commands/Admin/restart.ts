import { ApplicationCommand, ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export class RestartCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "restart",
        description: "Restart the bot",
        type: "CHAT_INPUT",
      },
      {
        category: "Admin",
        userPermissions: ["BOT_ADMIN"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    await this.client.handlers.applicationCommands.deleteAllCommands(
      "877090306103840778"
    );
    await interaction.replySuccessMessage(`Success`);
    return process.exit();
  }
}
