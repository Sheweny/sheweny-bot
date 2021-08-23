import util from "util";
import { ApplicationCommand, ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export class EvalCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "eval",
        description: "Eval a javascript code",
        options: [
          {
            name: "eval",
            description: "The code to eval",
            type: "STRING",
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
    let evaled: any = interaction.options.get("eval")!.value;
    try {
      if (
        interaction.options.get("options")?.value === "a" ||
        interaction.options.get("options")?.value === "async"
      ) {
        evaled = `(async () => { ${(
          interaction.options.get("eval")!.value as string
        ).trim()} })()`;
      }

      evaled = await eval(evaled! as string);
      if (typeof evaled === "object") {
        evaled = util.inspect(evaled, { depth: 0, showHidden: true });
      } else {
        evaled = String(evaled);
      }
    } catch (err: any) {
      return interaction.reply(`\`\`\`js\n${err.stack}\`\`\``);
    }
    const token = this.client.config.token;
    const regex = new RegExp(token + "g");
    evaled = evaled.replace(regex, "no.");

    const fullLen = evaled.length;

    if (fullLen === 0) {
      return null;
    }
    if (fullLen > 2000) {
      evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
      if (evaled.length > 3) {
        interaction.channel!.send({
          content: `\`\`\`js\n${evaled![0] as string}\`\`\``,
        });
        interaction.channel!.send({
          content: `\`\`\`js\n${evaled![1] as string}\`\`\``,
        });
        interaction.channel!.send({
          content: `\`\`\`js\n${evaled![2] as string}\`\`\``,
        });
        return;
      }
      return evaled.forEach((message: any) => {
        interaction.reply(`\`\`\`js\n${message}\`\`\``);
        return;
      });
    }
    return interaction.reply({ content: `\`\`\`js\n${evaled}\`\`\`` });
  }
}
