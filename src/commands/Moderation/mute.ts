import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import type { CommandInteraction } from "discord.js";

export class MuteCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "mute",
        description: "Mute a user",
        options: [
          {
            name: "user",
            type: "STRING",
            description: "The user to mute",
            required: true,
          },
          {
            name: "time",
            description: "The time of mute",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        category: "Moderation",
        userPermissions: ["KICK_MEMBERS"],
        clientPermissions: ["KICK_MEMBERS"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    const argUser = interaction.options.get("user")!.value;
    const argTime: string = interaction.options.get("time")!.value as string;
    const user = await this.client.util.resolveMember(
      interaction.guild,
      argUser
    );
    let muteRole = interaction.guild!.roles.cache.find(
      (r) => r.name === "Muted"
    );
    const muteTime = argTime || "60s";
    if (!user) return interaction.replyErrorMessage(`User not found.`);
    if (!muteRole) {
      muteRole = await interaction.guild!.roles.create({
        name: "Muted",
        color: "#2f3136",
        permissions: [],
      });
      interaction.guild!.channels.cache.forEach(async (channel: any) => {
        if (channel.isThread()) return;
        await channel.updateOverwrite!(muteRole!, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false,
        });
      });
    }

    await user.roles.add(muteRole.id);
    interaction.replySuccessMessage(
      `<@${user.id}> is muted for ${ms(ms(muteTime))}.`
    );

    setTimeout(() => {
      user.roles.remove(muteRole!.id);
    }, ms(muteTime));
    const embed = new MessageEmbed()
      .setAuthor(
        `${user.user.username} (${user.id})`,
        user.user.displayAvatarURL()
      )
      .setColor(this.client.colors.orange)
      .setDescription(`**Action**: mute\n**Time**: ${ms(ms(muteTime))}`)
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL()
      );
    if (this.client.config.moderation_logs) {
      const channel = this.client.util.resolveChannel(
        interaction.guild,
        this.client.config.moderation_logs
      );
      if (channel) {
        if (
          channel.permissionsFor(interaction.guild!.me).has("SEND_MESSAGES")
        ) {
          channel.send({ embeds: [embed] });
        }
      }
    }
  }
}
