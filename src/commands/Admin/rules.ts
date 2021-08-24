import { ApplicationCommand, ShewenyClient } from "sheweny";
import { CommandInteraction, MessageEmbed } from "discord.js";

export class RestartCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "rules",
        description: "Display the rules of the guild",
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
        "https://cdn.discordapp.com/attachments/877212134931578932/879430764985458768/Sheweny_banner.jpg"
      )
      .setTimestamp()
      .setFooter("Sheweny discord server rules");

    const channel = this.client.util.resolveChannel(
      interaction.guild,
      interaction.options.get("channel")!.value
    );
    if (!channel) return interaction.replyErrorMessage("Channel not found");
    interaction.replySuccessMessage("OK .");
    channel.send({ embeds: [embed] });
  }
}
