import { ApplicationCommand, ShewenyClient } from "sheweny";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";

export class RestartCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "rules",
        description: "Display the rules of the guild",
        type: "CHAT_INPUT",
        options: [
          {
            name: "channel",
            description: "Channel to send the rules",
            type: "CHANNEL",
            required: true,
          },
        ],
      },
      {
        category: "Admin",
        userPermissions: ["BOT_ADMIN"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    const embed = new MessageEmbed()
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
        "https://cdn.discordapp.com/attachments/877217860408209449/879781364742893598/20210824_191118_0000__01.png"
      )
      .setTimestamp()
      .setFooter("Sheweny discord server rules");

    const channel = interaction.options.getChannel("channel", true) as TextChannel;
    if (!channel) return interaction.replyErrorMessage("Channel not found");
    await interaction.replySuccessMessage("Success");
    const button = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("ruleCheck").setLabel("Check").setStyle("SUCCESS")
    );
    channel.send({ embeds: [embed], components: [button] });
  }
}
