import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class PurgeCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "purge",
        description: "Purge messages",
        options: [
          {
            name: "messages",
            description: "Delete messages in a channel.",
            type: "SUB_COMMAND",
            options: [
              {
                name: "number",
                description: "Number of messages",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "user",
            description: "Purge messages from single user.",
            type: "SUB_COMMAND",
            options: [
              {
                name: "user",
                description: "User",
                type: "STRING",
                required: true,
              },
              {
                name: "number",
                description: "Number of messages",
                type: "STRING",
                required: true,
              },
            ],
          },
        ],
      },
      {
        category: "Moderation",
        userPermissions: ["MANAGE_MESSAGES"],
      }
    );
  }
  async execute(interaction: CommandInteraction) {
    switch (interaction.options.getSubcommand(false)) {
      case "messages":
        const channelTextMessages: any = interaction.channel;
        const messagesToDelete = await interaction.channel!.messages.fetch({
          limit: Math.min(
            parseInt(interaction.options.get("number")!.value as string),
            100
          ),
          before: interaction.id,
        });
        const embedMessages = new MessageEmbed()
          .setAuthor(
            interaction.user.username,
            interaction.user.displayAvatarURL()
          )
          .setColor(this.client.colors.red)
          .setDescription(
            `**Action**: purge messages\n**Messages**: ${
              interaction.options.get("number")!.value
            }\n**Channel**: ${interaction.channel}`
          )
          .setTimestamp()
          .setFooter(`Executor : ${interaction.user.username}`);
        channelTextMessages
          .bulkDelete(messagesToDelete)
          .then(() => {
            interaction.reply({ embeds: [embedMessages] }).then(() => {
              setTimeout(function () {
                interaction.deleteReply();
              }, 3000);
            });
          })
          .catch((err: Error) => {
            if (
              err.message.match(
                "You can only bulk delete messages that are under 14 days old"
              )
            )
              interaction.replyErrorMessage(
                `You cannot delete messages older than 14 days.`
              );
            else
              interaction.replyErrorMessage(
                `An error occurred. Please try again.`
              );
            console.error(err);
          });
        break;
      case "user":
        const argNumber = parseInt(
          interaction.options.get("number")!.value as string
        );
        const channelTextUser: any = interaction.channel;
        const user = await this.client.util.resolveMember(
          interaction.guild,
          interaction.options.get("user")!.value
        );
        if (isNaN(argNumber) || argNumber < 1 || argNumber > 100)
          return interaction.replyErrorMessage(
            `You must specify a number between 1 and 100.`
          );
        const messagesOfUser: any = (
          await interaction.channel!.messages.fetch({
            limit: 100,
            before: interaction.id,
          })
        ).filter((a) => a.author.id === user.id);
        messagesOfUser.length = Math.min(argNumber, messagesOfUser.length);
        if (messagesOfUser.length === 0 || !user)
          return interaction.replyErrorMessage(`No message to delete`);
        if (messagesOfUser.length === 1) await messagesOfUser[1].delete();
        else await channelTextUser.bulkDelete(messagesOfUser);
        interaction.deleteReply();
        const embedLogs = new MessageEmbed()
          .setAuthor(
            interaction.user.username,
            interaction.user.displayAvatarURL()
          )
          .setColor(this.client.colors.red)
          .setDescription(
            `**Action**: prune\n**Messages**: ${argNumber}\n**User**: ${user}`
          );
        interaction.reply({ embeds: [embedLogs] });
        break;
    }
  }
}
