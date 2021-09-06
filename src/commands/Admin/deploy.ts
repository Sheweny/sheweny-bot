import { Command, ShewenyClient } from "sheweny";
import { exec } from "child_process";
import type { CommandInteraction } from "discord.js";

export class PullCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "deploy",
      description: "Deploy new version of bot",
      type: "SLASH_COMMAND",
      category: "Admin",
      adminsOnly: true,
    });
  }
  async execute(interaction: CommandInteraction) {
    let error = false;
    const status = [
      {
        name: "Pull",
        command: "git pull origin main",
        type: "shell",
        status: "queuded",
        error: "",
      },
      {
        name: "Npm install",
        command: "npm install",
        type: "shell",
        status: "queuded",
        error: "",
      },
      {
        name: "Typescript",
        command: "tsc",
        type: "shell",
        status: "queuded",
        error: "",
      },
      {
        name: "Delete commands",
        command: "deleteAllCommands()",
        type: "bot",
        status: "queuded",
        error: "",
      },
      {
        name: "Restart",
        command: "process.exit()",
        type: "bot",
        status: "queuded",
        error: "",
      },
    ];
    function propertyIndexOf(arr: any[], key: string, condition: any) {
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i][key] === condition) {
          return i;
        }
      }
      return null;
    }
    const doExec = (cmd: string, opts = {}): Promise<any> => {
      return new Promise((resolve, reject) => {
        exec(cmd, opts, (err, stdout, stderr) => {
          if (err) return reject({ stdout, stderr });
          resolve(stdout);
        });
      });
    };
    const outputErr = async (name: string, stdData: any) => {
      error = true;
      const { stdout, stderr } = stdData;
      const message = stdout.concat(`\`\`\`${stderr}\`\`\``);
      const item = propertyIndexOf(status, "name", name);

      if (!item) return;
      status[item] = {
        name: name,
        command: status[item].command,
        type: status[item].type,
        status: "error",
        error: message || "",
      };
      await interaction.editReply({ content: text(this.client) });
    };
    const outputSuccess = async (name: string) => {
      const item = propertyIndexOf(status, "name", name);
      if (item == null) return;
      status[item] = {
        name: name,
        command: status[item].command,
        type: status[item].type,
        status: "success",
        error: "",
      };
      await interaction.editReply({ content: text(this.client) });
    };
    function text(c: ShewenyClient) {
      let msg = "";
      for (const st of status) {
        if (st.status === "success")
          msg += `${c.config.emojis.success} __**${st.name} :**__ Success (\`${st.command}\`)\n`;
        if (st.status === "error")
          msg += `${c.config.emojis.error} __**${st.name} :**__ Failed (\`${st.command}\`)\nError :\n${st.error}\n`;
        if (st.status === "queuded")
          msg += `${c.config.emojis.loading} __**${st.name} :**__ Queued (\`${st.command}\`)\n`;
      }
      return msg;
    }
    await interaction.reply({ content: text(this.client) });
    async function execShellCommand(cmd: any) {
      await doExec(cmd.command)
        .then(async () => {
          await outputSuccess(cmd.name);
        })
        .catch(async (data) => {
          await outputErr(cmd.name, data);
        });
    }
    async function execBotCommand(cmd: any, client: ShewenyClient) {
      if (cmd.name === "Delete commands") {
        await client.handlers
          .commands!.deleteAllCommands("877090306103840778")
          .then(async () => {
            await outputSuccess(cmd.name);
          })
          .catch(async (data) => {
            await outputErr(cmd.name, data);
          });
      } else if (cmd.name === "Restart") {
        await outputSuccess(cmd.name);
        process.exit();
      }
    }
    for (const cmd of status) {
      if (error) return;
      if (cmd.type === "shell") await execShellCommand(cmd);
      else await execBotCommand(cmd, this.client);
      await await new Promise((res) => setTimeout(res, 3000));
    }

    // let stdOut = await doExec(`git pull origin ${command}`).catch((data) =>
    //   outputErr(data)
    // );
    // return interaction.editReply(`\`\`\`bash\n${stdOut.toString()}\n\`\`\``);
  }
}
