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
    await interaction.reply({ content: `${this.client.config.emojis.success} Success` });
    return process.exit();
  }
}
