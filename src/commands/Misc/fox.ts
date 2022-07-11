import axios from "axios";
import { Command } from "sheweny";
import { CommandInteraction, MessageEmbed } from "discord.js";
import type { ShewenyClient } from "sheweny";

export class Fox extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "fox",
      type: "SLASH_COMMAND",
      category: "Misc",
      description: "Return random fox picture.",
      cooldown: 10,
    });
  }

  async execute(interaction: CommandInteraction) {
    const request = await axios.get("https://randomfox.ca/floof/");
    const { data } = request;
    const embed = new MessageEmbed().setImage(data.image);
    interaction.reply({ embeds: [embed] });
  }
}
