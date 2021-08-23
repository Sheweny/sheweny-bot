import { ApplicationCommand, ShewenyClient } from "sheweny";
import { exec } from "child_process";
import type { CommandInteraction } from "discord.js";

export class PullCommand extends ApplicationCommand {
  constructor(client: ShewenyClient) {
    super(
      client,
      {
        name: "pull",
        description: "Pull the code of bot in github repo",
        options: [
          {
            name: "origin",
            type: "STRING",
            description: "The branch to pull",
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
    const outputErr = (msg: CommandInteraction, stdData: any) => {
      const { stdout, stderr } = stdData;
      const message = stdout.concat(`\`\`\`${stderr}\`\`\``);
      msg.editReply(message);
    };
    const doExec = (cmd: string, opts = {}): Promise<any> => {
      return new Promise((resolve, reject) => {
        exec(cmd, opts, (err, stdout, stderr) => {
          if (err) return reject({ stdout, stderr });
          resolve(stdout);
        });
      });
    };
    const command = interaction.options.get("branch")!.value;
    await interaction.reply(
      `${this.client.config.emojis.loading} Executing \`${command}\`...`
    );
    let stdOut = await doExec(`git pull origin ${command as string}`).catch(
      (data) => outputErr(interaction, data)
    );
    return interaction.editReply(`\`\`\`bash\n${stdOut.toString()}\n\`\`\``);
  }
}
