import axios from "axios";
import { Command } from "sheweny";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import type { ShewenyClient } from "sheweny";

export class Bird extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "bird",
      type: "SLASH_COMMAND",
      category: "Misc",
      description: "Return random bird picture.",
      cooldown: 10,
    });
  }

  async execute(interaction: CommandInteraction) {
    const request = await axios.get("http://shibe.online/api/birds");
    const { data } = request;
    const embed = new EmbedBuilder().setImage(data[0]);
    interaction.reply({ embeds: [embed] });
  }
}
