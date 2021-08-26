import { Event } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { ShewenyClient } from "sheweny";
import type { GuildMember, TextChannel } from "discord.js";

export class Ready extends Event {
  constructor(client: ShewenyClient) {
    super(client, "guildMemberAdd", {
      description: "Member joined guild",
    });
  }

  execute(newMember: GuildMember) {
    if (newMember.guild.id === "877090306103840778") {
      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`**[+]** ${newMember.user.tag}`)
        .setThumbnail(newMember.user.displayAvatarURL())
        .setDescription(
          "The user " + newMember.user.username + " just joined the guild"
        )

        .setTimestamp()
        .setFooter("Member joined the guild");
      const channel = newMember.guild.channels.cache.get(
        "877472366991646730"
      ) as TextChannel;
      if (!channel) return;
      channel.send({ embeds: [embed] });
    }
  }
}
