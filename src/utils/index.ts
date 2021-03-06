import {
  ColorResolvable,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Guild,
  GuildMember,
  EmbedBuilder,
  MessageOptions,
  MessagePayload,
  TextChannel,
  User,
} from "discord.js";
import type { ShewenyClient } from "sheweny";

export function sendLogChannel(
  client: ShewenyClient,
  interaction: CommandInteraction | ContextMenuCommandInteraction,
  options: string | MessageOptions | MessagePayload
) {
  const channel = client.util.resolveChannel(
    interaction.guild!,
    client.config.CHANNELS.LOGS
  ) as TextChannel;
  if (
    channel &&
    channel
      .permissionsFor(interaction.guild!.client!.user!)!
      .has("SendMessages")
  )
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
    time?: number;
    messages?: number;
  }
) {
  let description = `**Action**: ${action}`;
  if (options?.reason) description += `\n**Reason**: ${options.reason}`;
  if (options?.time) description += `\n**Time**: ${formatTime(options?.time)}`;
  if (options?.messages)
    description += `\n**Messages**: ${options.messages} messages`;
  if (options?.guild) description += `\n**Guild**: ${options.guild.name}`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: author.username,
      iconURL: author.displayAvatarURL({
        forceStatic: false,
        extension: "png",
        size: 512,
      }),
    });

  if (member) {
    const m = member instanceof GuildMember ? member.user : member;
    embed.setAuthor({
      name: `${m.tag} (${m.id})`,
      iconURL: m.displayAvatarURL({
        forceStatic: false,
        extension: "png",
        size: 512,
      }),
    });
  }

  return embed;
}

// Time in milleseconds
export function formatTime(time: number): string {
  if (time < 3600 * 1000) return `${time / (60 * 1000)} minutes(s)`;
  if (time < 86400 * 1000) return `${time / (3600 * 1000)} hour(s)`;
  if (time < 604800 * 1000) return `${time / (86400 * 1000)} day(s)`;
  return `${time / (604800 * 1000)} week(s)`;
}
