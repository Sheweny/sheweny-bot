import { ApplicationCommand, ShewenyClient } from "sheweny";
import { GuildMember, MessageEmbed } from "discord.js";
import ms from "ms";
import type { CommandInteraction } from "discord.js";

export class MuteCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "mute",
        description: "Mute a user",
        type: "CHAT_INPUT",
        options: [
          {
            name: "user",
            type: "USER",
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
    const member = interaction.options.getMember("user", true) as GuildMember;
    const muteTime = interaction.options.getString("time", false);

    let muteRole = interaction.guild!.roles.cache.find((r) => r.name === "Muted");
    if (!member) return interaction.replyErrorMessage(`User not found.`, true);
    if (!muteRole) {
      muteRole = await interaction.guild!.roles.create({
        name: "Muted",
        color: "#2f3136",
        permissions: [],
      });
      interaction.guild!.channels.cache.forEach(async (channel) => {
        if (channel.isThread()) return;
        await channel.permissionOverwrites.edit(muteRole!, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false,
        });
      });
    }

    await member.roles.add(muteRole.id);
    interaction.replySuccessMessage(
      `<@${member.id}> is muted for ${muteTime ? ms(ms(muteTime)) : "ever"}.`
    );

    if (muteTime)
      setTimeout(() => {
        member.roles.remove(muteRole!.id);
      }, ms(muteTime));
    const embed = new MessageEmbed()
      .setAuthor(
        `${member.user.tag} (${member.id})`,
        member.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      )
      .setColor(this.client.colors.orange)
      .setDescription(
        `**Action**: mute\n**Time**: ${muteTime ? ms(ms(muteTime)) : "ever"}`
      )
      .setTimestamp()
      .setFooter(
        interaction.user.username,
        interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
      );
    if (this.client.config.moderation_logs) {
      const channel = this.client.util.resolveChannel(
        interaction.guild,
        this.client.config.moderation_logs
      );
      if (channel) {
        if (channel.permissionsFor(interaction.guild!.me).has("SEND_MESSAGES")) {
          channel.send({ embeds: [embed] });
        }
      }
    }
  }
}
