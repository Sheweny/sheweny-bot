import { Event } from "sheweny";
import { Colors, EmbedBuilder } from "discord.js";
import type { ShewenyClient } from "sheweny";
import type { GuildMember, TextChannel } from "discord.js";

export class Ready extends Event {
  constructor(client: ShewenyClient) {
    super(client, "guildMemberRemove", {
      description: "Member left guild",
    });
  }

  execute(newMember: GuildMember) {
    if (newMember.guild.id === "877090306103840778") {
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`**[-]** ${newMember.user.tag}`)
        .setThumbnail(newMember.user.displayAvatarURL())
        .setDescription(
          "The user " + newMember.user.username + " just left the guild"
        )
        .setTimestamp()
        .setFooter({ text: "Member left the guild" });
      const channel = newMember.guild.channels.cache.get(
        "877472366991646730"
      ) as TextChannel;
      if (!channel) return;
      channel.send({ embeds: [embed] });
    }
  }
}
