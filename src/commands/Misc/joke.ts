import axios from "axios";
import { Command } from "sheweny";
import { CommandInteraction, MessageEmbed } from "discord.js";
import type { ShewenyClient } from "sheweny";

export class Joke extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "joke",
      type: "SLASH_COMMAND",
      category: "Misc",
      description: "Return random joke about programming.",
      cooldown: 10,
    });
  }

  async execute(interaction: CommandInteraction) {
    const request = await axios.get("https://v2.jokeapi.dev/joke/Programming");
    const { data } = request;
    const embed = new MessageEmbed();
    if (data.type === "single") {
      embed.setDescription(data.joke);
    } else {
      embed.setDescription(`${data.setup}\n||${data.delivery}||`);
    }
    interaction.reply({ embeds: [embed] });
  }
}
