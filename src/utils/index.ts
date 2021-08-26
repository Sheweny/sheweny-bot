import {
  ColorResolvable,
  CommandInteraction,
  ContextMenuInteraction,
  Guild,
  GuildMember,
  MessageEmbed,
  MessageOptions,
  MessagePayload,
  TextChannel,
  User,
} from "discord.js";
import ms from "ms";
import type { ShewenyClient } from "sheweny";

export function sendLogChannel(
  client: ShewenyClient,
  interaction: CommandInteraction | ContextMenuInteraction,
  options: string | MessageOptions | MessagePayload
) {
  const channel = client.util.resolveChannel(
    interaction.guild!,
    client.config.channels.moderation_logs
  ) as TextChannel;
  if (channel && channel.permissionsFor(interaction.guild!.me!).has("SEND_MESSAGES"))
    channel.send(options);
}

export function embedMod(
  member: GuildMember | User | undefined,
  author: User,
  color: ColorResolvable,
  action: string,
  options?: {
    reason?: string;
    guild?: Guild;
    time?: string;
    messages?: number;
  }
) {
  let description = `**Action**: ${action}`;
  if (options?.reason) description += `\n**Reason**: ${options.reason}`;
  if (options?.time)
    description += `\n**Time**: ${
      options.time !== "ever" ? ms(ms(options.time)) : "ever"
    }`;
  if (options?.messages) description += `\n**Messages**: ${options.messages} messages`;
  if (options?.guild) description += `\n**Guild**: ${options.guild.name}`;

  const embed = new MessageEmbed()
    .setColor(color)
    .setDescription(description)
    .setTimestamp()
    .setFooter(
      author.username,
      author.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
    );

  if (member) {
    const m = member instanceof GuildMember ? member.user : member;
    embed.setAuthor(
      `${m.tag} (${m.id})`,
      m.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
    );
  }

  return embed;
}
