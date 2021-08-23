import { ApplicationCommand, ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export class RestartCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "restart",
        description: "Restart the bot",
      },
      {
        category: "Admin",
        userPermissions: ["BOT_ADMIN"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    await interaction.replySuccessMessage(`OK .`);
    process.exit();
  }
}
