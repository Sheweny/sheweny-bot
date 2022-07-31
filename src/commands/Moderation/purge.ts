import { Command, ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import type { CommandInteraction } from "discord.js";

export class PurgeCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "purge",
      description: "Purge messages",
      type: "SLASH_COMMAND",
      category: "Moderation",
      options: [
        {
          name: "messages",
          description: "Delete messages in a channel.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "number",
              description: "Number of messages",
              type: ApplicationCommandOptionType.Number,
              required: true,
            },
          ],
        },
        {
          name: "user",
          description: "Purge messages from single user.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "User",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "number",
              description: "Number of messages",
              type: ApplicationCommandOptionType.Number,
              required: true,
            },
          ],
        },
      ],
      userPermissions: ["ManageMessages"],
      clientPermissions: ["ManageMessages"],
    });
  }
  async execute(interaction: CommandInteraction) {
    switch (interaction.options.get("messages")?.value as string) {
      case "messages":
        const channelTextMessages = interaction.channel! as TextChannel;
        const argsNumberMessages = interaction.options.get("number", true)
          .value as number;

        if (
          isNaN(argsNumberMessages) ||
          argsNumberMessages < 1 ||
          argsNumberMessages > 100
        )
          return interaction.reply({
            content: `${this.client.config.EMOTES.ERROR} You must specify a number between 1 and 100.`,
            ephemeral: true,
          });
        const messagesToDelete = await channelTextMessages.messages.fetch({
          limit: Math.min(argsNumberMessages, 100),
          before: interaction.id,
        });

        channelTextMessages
          .bulkDelete(messagesToDelete)
          .then(async () => {
            await interaction.reply({
              content: `${messagesToDelete.size} messages have been deleted`,
              ephemeral: true,
            });
          })
          .catch((err: Error) => {
            if (
              err.message.match(
                "You can only bulk delete messages that are under 14 days old"
              )
            )
              interaction.reply({
                content: `${this.client.config.EMOTES.ERROR} You cannot delete messages older than 14 days.`,
                ephemeral: true,
              });
            else {
              console.error(err);
              interaction.reply({
                content: `${this.client.config.EMOTES.ERROR} An error occurred. Please try again.`,
                ephemeral: true,
              });
            }
          });
        break;
      case "user":
        const argNumber = interaction.options.get("number", true)
          .value as number;
        const channelTextUser = interaction.channel as TextChannel;
        const user = interaction.options.getUser("user", true);
        if (isNaN(argNumber) || argNumber < 1 || argNumber > 100)
          return interaction.reply({
            content: `${this.client.config.EMOTES.ERROR} You must specify a number between 1 and 100.`,
            ephemeral: true,
          });

        const messagesOfUser: any = (
          await interaction.channel!.messages.fetch({
            limit: 100,
            before: interaction.id,
          })
        ).filter((a) => a.author.id === user.id);

        messagesOfUser.length = Math.min(argNumber, messagesOfUser.length);
        if (messagesOfUser.length === 0 || !user)
          return interaction.reply({
            content: `No message to delete`,
            ephemeral: true,
          });
        if (messagesOfUser.length === 1) await messagesOfUser[1].delete();
        else await channelTextUser.bulkDelete(messagesOfUser);

        await interaction.reply({
          content: `${messagesOfUser.size} messages from ${user.tag} have been deleted`,
          ephemeral: true,
        });
        break;
    }
  }
}
