import { ApplicationCommand, ShewenyClient } from "sheweny";
import { MessageEmbed, TextChannel } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class PurgeCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "purge",
        description: "Purge messages",
        type: "CHAT_INPUT",
        options: [
          {
            name: "messages",
            description: "Delete messages in a channel.",
            type: "SUB_COMMAND",
            options: [
              {
                name: "number",
                description: "Number of messages",
                type: "NUMBER",
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
                type: "USER",
                required: true,
              },
              {
                name: "number",
                description: "Number of messages",
                type: "NUMBER",
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
        const channelTextMessages = interaction.channel! as TextChannel;
        const messagesToDelete = await channelTextMessages.messages.fetch({
          limit: Math.min(interaction.options.getNumber("number", true), 100),
          before: interaction.id,
        });
        const embedMessages = new MessageEmbed()
          .setAuthor(
            interaction.user.username,
            interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
          )
          .setColor(this.client.colors.red)
          .setDescription(
            `**Action**: purge messages\n**Messages**: ${interaction.options.getNumber(
              "number",
              true
            )}\n**Channel**: ${channelTextMessages.name}`
          )
          .setTimestamp()
          .setFooter(`Executor : ${interaction.user.username}`);
        channelTextMessages
          .bulkDelete(messagesToDelete)
          .then(async () => {
            await interaction.reply({ embeds: [embedMessages], ephemeral: true });
          })
          .catch((err: Error) => {
            if (
              err.message.match(
                "You can only bulk delete messages that are under 14 days old"
              )
            )
              interaction.replyErrorMessage(
                `You cannot delete messages older than 14 days.`,
                true
              );
            else
              interaction.replyErrorMessage(`An error occurred. Please try again.`, true);
            console.error(err);
          });
        break;
      case "user":
        const argNumber = interaction.options.getNumber("number", true);
        const channelTextUser = interaction.channel as TextChannel;
        const user = interaction.options.getUser("user", true);
        if (isNaN(argNumber) || argNumber < 1 || argNumber > 100)
          return interaction.replyErrorMessage(
            `You must specify a number between 1 and 100.`,
            true
          );
        const messagesOfUser: any = (
          await interaction.channel!.messages.fetch({
            limit: 100,
            before: interaction.id,
          })
        ).filter((a) => a.author.id === user.id);

        messagesOfUser.length = Math.min(argNumber, messagesOfUser.length);
        if (messagesOfUser.length === 0 || !user)
          return interaction.replyErrorMessage(`No message to delete`, true);
        if (messagesOfUser.length === 1) await messagesOfUser[1].delete();
        else await channelTextUser.bulkDelete(messagesOfUser);

        const embedLogs = new MessageEmbed()
          .setAuthor(
            interaction.user.username,
            interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
          )
          .setColor(this.client.colors.red)
          .setDescription(
            `**Action**: purge\n**Messages**: ${argNumber}\n**User**: ${user.tag}`
          );
        await interaction.reply({ embeds: [embedLogs], ephemeral: true });
        break;
    }
  }
}
