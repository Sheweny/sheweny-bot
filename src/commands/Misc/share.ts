import { Command } from "sheweny";
import { CommandInteraction, MessageEmbed } from "discord.js";
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
          type: "STRING",
          description: "url of qr code",
          required: true,
        },
        {
          name: "description",
          type: "STRING",
          description: "description of shared content",
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const url = interaction.options.getString("url", true);
    const description = interaction.options.getString("description", true);
    const embed = new MessageEmbed()
      .setDescription(`${description}\n${url}`)
      .setImage(`https://qrtag.net/api/qr_6.png?url=${url}`);
    interaction.reply({ embeds: [embed] });
  }
}
