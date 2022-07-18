import { Command } from "sheweny";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import type { ShewenyClient } from "sheweny";

export class Share extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "share",
      type: "SLASH_COMMAND",
      category: "Misc",
      description: "Return QR code.",
      cooldown: 1000000,
      options: [
        {
          name: "url",
          type: ApplicationCommandOptionType.String,
          description: "url of qr code",
          required: true,
        },
        {
          name: "description",
          type: ApplicationCommandOptionType.String,
          description: "description of shared content",
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const url = interaction.options.get("url", true).value as string;
    const description = interaction.options.get("description", true)
      .value as string;
    const embed = new EmbedBuilder()
      .setDescription(`${description}\n${url}`)
      .setImage(`https://qrtag.net/api/qr_6.png?url=${url}`);
    interaction.reply({ embeds: [embed] });
  }
}
