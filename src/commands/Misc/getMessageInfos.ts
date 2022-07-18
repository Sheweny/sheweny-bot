import { Command } from "sheweny";
import { EmbedBuilder } from "discord.js";
import type { ShewenyClient } from "sheweny";
import type { ContextMenuCommandInteraction } from "discord.js";

export class GetAvatar extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "send-embed",
      type: "CONTEXT_MENU_MESSAGE",
      category: "Misc",
      description: "Get avatar of user",
      cooldown: 10,
    });
  }

  async execute(interaction: ContextMenuCommandInteraction) {
    const message = await interaction.channel!.messages.fetch(
      interaction.targetId
    );
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(message.content)
      .setColor("Random")
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
}
