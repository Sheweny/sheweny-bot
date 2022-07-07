import { Command, ShewenyClient } from "sheweny";
import { exec } from "child_process";
import type { CommandInteraction } from "discord.js";

export class PullCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "pull",
      description: "Pull the code of bot in github repo",
      type: "SLASH_COMMAND",
      category: "Admin",
      options: [
        {
          name: "branch",
          type: "STRING",
          description: "The branch to pull",
          required: true,
        },
      ],
      adminsOnly: true,
    });
  }
  async execute(interaction: CommandInteraction) {
    const outputErr = async (stdData: any) => {
      const { stdout, stderr } = stdData;
      const message = stdout.concat(`\`\`\`${stderr}\`\`\``);
      await interaction.editReply(message);
    };

    const doExec = (cmd: string, opts = {}): Promise<any> => {
      return new Promise((resolve, reject) => {
        exec(cmd, opts, (err, stdout, stderr) => {
          if (err) return reject({ stdout, stderr });
          resolve(stdout);
        });
      });
    };

    const command = interaction.options.getString("branch", true);
    await interaction.reply(
      `${this.client.config.EMOTES.LOADING} Executing \`git pull origin ${command}\`...`
    );

    let stdOut = await doExec(`git pull origin ${command}`).catch((data) =>
      outputErr(data)
    );
    return interaction.editReply(`\`\`\`bash\n${stdOut.toString()}\n\`\`\``);
  }
}
