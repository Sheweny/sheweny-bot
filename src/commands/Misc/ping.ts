import { ApplicationCommand } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export class PingCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "ping",
        description: "Ping Pong",
        type: "CHAT_INPUT",
      },
      {
        category: "Misc",
      }
    );
  }

  execute(interaction: CommandInteraction) {
    return interaction.reply("Pong !");
  }
}
