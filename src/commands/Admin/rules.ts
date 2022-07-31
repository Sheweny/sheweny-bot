import { Command, ShewenyClient } from "sheweny";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  ButtonBuilder,
  EmbedBuilder,
  TextChannel,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

export class RestartCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "rules",
      description: "Display the rules of the guild",
      type: "SLASH_COMMAND",
      category: "Admin",
      options: [
        {
          name: "channel",
          description: "Channel to send the rules",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
      adminsOnly: true,
    });
  }
  async execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle("Welcome to Sheweny")
      .setColor("#ff5bba")
      .setDescription(
        `This is the official Sheweny Server. You can ask for help with it in <#877472865048485890> and <#877472890403033128>, and talk in <#877473263679328266>. We also need your feedback, feel free do to so in the dedicated channels!

        **Rules**
- Follow the [Discord Community Guidelines](https://discord.com/guidelines)
- Don't be annoying
- Don't cold ping users
- Use help channels for support with sheweny only
- No NSFW allowed
- No advertising/self-promotion
allowed, that also includes DMs ads.
- That list is not exhaustive, moderators can moderate at their discretion.

**Links**
[Website](https://sheweny.js.org/)
[Github](https://github.com/Sheweny)
[NPM](https://www.npmjs.com/package/sheweny)
[Yarn](https://yarnpkg.com/package/sheweny)
Server Invite: https://discord.gg/qgd85nEf5a
`
      )
      .setImage(
        "https://media.discordapp.net/attachments/881988260925153322/882027519753224244/sheweny_baniere.png"
      )
      .setTimestamp()
      .setFooter({ text: "Sheweny discord server rules" });

    const channel = interaction.options.get("channel", true)
      .channel as TextChannel;
    if (!channel)
      return interaction.reply({
        content: `${this.client.config.EMOTES.ERROR} Channel not found`,
      });
    await interaction.reply({
      content: `${this.client.config.EMOTES.SUCCESS} Success`,
    });
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ruleCheck")
        .setLabel("Check")
        .setStyle(ButtonStyle.Success)
    );
    channel.send({ embeds: [embed], components: [button] });
  }
}
