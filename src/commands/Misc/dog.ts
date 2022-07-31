import axios from "axios";
import { Command } from "sheweny";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import type { ShewenyClient } from "sheweny";

export class Dog extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "dog",
      type: "SLASH_COMMAND",
      category: "Misc",
      description: "Return random dog picture.",
      cooldown: 10,
    });
  }

  async execute(interaction: CommandInteraction) {
    const request = await axios.get("https://random.dog/woof.json");
    const { data } = request;
    const embed = new EmbedBuilder().setImage(data.url);
    interaction.reply({ embeds: [embed] });
  }
}
