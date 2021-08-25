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
        type: "CHAT_INPUT",
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
        interaction.options.getString("user")
      );
      if (!user) return interaction.replyErrorMessage(`User not found.`, true);
      interaction.guild!.members.unban(user);
      const embed = new MessageEmbed()
        .setAuthor(
          `${user.username} (${user.id})`,
          user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
        )
        .setColor(this.client.colors.red)
        .setDescription(`**Action**: unban`)
        .setTimestamp()
        .setFooter(
          interaction.user.username,
          interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });

      const channel = this.client.util.resolveChannel(
        interaction.guild,
        this.client.config.channels.moderation_logs
      );
      if (channel && channel.permissionsFor(interaction.guild!.me).has("SEND_MESSAGES"))
        channel.send({ embeds: [embed] });
    } catch (e: any) {
      console.log(e);

      if (e.message.match("Unknown User"))
        return interaction.replyErrorMessage(`User not found.`, true);
      else
        return interaction.replyErrorMessage(
          `An error has occurred. Please try again.`,
          true
        );
    }
  }
}
