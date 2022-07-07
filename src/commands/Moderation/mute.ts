import { Command, ShewenyClient } from "sheweny";
import { GuildMember, } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { embedMod, sendLogChannel, formatTime } from "../../utils";

export class MuteCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "mute",
      description: "Mute a user",
      type: "SLASH_COMMAND",
      category: "Moderation",
      options: [
        {
          name: "user",
          type: "USER",
          description: "The user to mute",
          required: true,
        },
        {
          name: "time",
          type: "INTEGER",
          description: "The time of mute",
          choices: [{
            name: "60 secondes",
            value: 1000 * 60
          },
          {
            name: "5 mins",
            value: 1000 * 5 * 60
          },
          {
            name: "10 mins",
            value: 1000 * 10 * 60
          },
          {
            name: "1 hour",
            value: 1000 * 60 * 60
          },
          {
            name: "1 day",
            value: 1000 * 24 * 60 * 60
          },
          {
            name: "1 week",
            value: 1000 * 7 * 24 * 60 * 60
          }],
          required: true,
        },
        {
          name: "reason",
          description: "The reason of mute",
          type: "STRING",
          required: false,
        },
      ],
      userPermissions: ["MODERATE_MEMBERS"],
      clientPermissions: ["MODERATE_MEMBERS"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const member = interaction.options.getMember("user", true) as GuildMember;
    const muteTime = interaction.options.getInteger("time", true);
    const reason =
      interaction.options.getString("reason", false) || "No reason was given";

    if (!member)
      return interaction.reply({
        content: `${this.client.config.emojis.error} User not found`,
        ephemeral: true,
      });

    if (member === interaction.member) {
      return interaction.reply({ content: "You cannot use this command on yourself", ephemeral: true })
    }

    member.timeout(muteTime, reason)

    const embed = embedMod(
      member,
      interaction.user,
      this.client.config.colors.red,
      "mute",
      { reason, guild: interaction.guild!, time: muteTime }
    );

    interaction.reply({
      content: `${this.client.config.emojis.success} <@${member.id
        }> is muted for ${formatTime(muteTime)}.`,
      ephemeral: true,
    });


    sendLogChannel(this.client, interaction, { embeds: [embed] });
  }
}
