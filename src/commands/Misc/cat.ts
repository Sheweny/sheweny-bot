import axios from "axios";
import { Command } from "sheweny";
import { CommandInteraction, MessageEmbed } from "discord.js";
import type { ShewenyClient } from "sheweny";

export class Cat extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "cat",
      type: "SLASH_COMMAND",
      category: "Misc",
      description: "Return random cat picture.",
      cooldown: 10,
    });
  }

  async execute(interaction: CommandInteraction) {
    const request = await axios.get("https://aws.random.cat/meow");
    const { data } = request;
    const embed = new MessageEmbed().setImage(data.file);
    interaction.reply({ embeds: [embed] });
  }
}
