import { ApplicationCommand } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ContextMenuInteraction } from "discord.js";

export class GetAvatar extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "getAvatar",
        type: "USER",
      },
      {
        category: "Misc",
        description: "Get avatar of user",
        cooldown: 10,
      }
    );
  }

  execute(interaction: ContextMenuInteraction) {
    return interaction.reply({
      content: interaction.options
        .getUser("user")
        ?.displayAvatarURL({ dynamic: true, format: "png", size: 512 }),
    });
  }
}
