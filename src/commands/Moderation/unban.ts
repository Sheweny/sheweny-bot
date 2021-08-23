import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class UnbanCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "unban",
        description: "Unban user in the guild",
        options: [
          {
            name: "user",
            type: "STRING",
            description: "The user to unban",
            required: true,
          },
        ],
      },
      {
        category: "Moderation",
        userPermissions: ["BAN_MEMBERS"],
        clientPermissions: ["MANAGE_MEMBERS"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    try {
      const user = await this.client.util.resolveUser(
        interaction.options.get("user")!.value
      );
      if (!user) return interaction.replyErrorMessage(`User not found.`);
      interaction.guild!.members.unban(user);
      const embed = new MessageEmbed()
        .setAuthor(`${user.username} (${user.id})`, user.displayAvatarURL())
        .setColor(this.client.colors.red)
        .setDescription(`**Action**: unban`)
        .setTimestamp()
        .setFooter(
          interaction.user.username,
          interaction.user.displayAvatarURL()
        );
      interaction.reply({ embeds: [embed] });
    } catch (e: any) {
      console.log(e);

      if (e.message.match("Unknown User"))
        return interaction.replyErrorMessage(`User not found.`);
      else
        return interaction.replyErrorMessage(
          `An error has occurred. Please try again.`
        );
    }
  }
}
