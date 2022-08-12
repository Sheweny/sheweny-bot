import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction } from "discord.js";
export class PingCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "ping",
      description: "Ping Pong",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 10,
      userPermissions: ["SendMessages"],
    });
  }

  async execute(interaction: CommandInteraction) {
    interaction.reply({ content: "Pong!" });
  }
}
