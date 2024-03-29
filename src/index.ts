import { readFileSync } from "fs";
import { join } from "path";
import { CommandInteraction, Message, Partials } from "discord.js";
import { ShewenyClient } from "sheweny";
import { IConfig } from "./interfaces/Config";
import dotenv from "dotenv";
dotenv.config();

const constants = require("./utils/Constants");

const packageInfos = readFileSync(
  join(__dirname, "../package.json")
).toString();

declare module "sheweny" {
  interface ShewenyClient {
    config: IConfig;
  }
}

class Client extends ShewenyClient {
  readonly config: IConfig = constants;

  constructor() {
    super({
      admins: constants.BOT_ADMINS,
      intents: ["Guilds", "GuildMembers", "GuildMessages"],
      partials: [Partials.GuildMember],
      mode: "development",
      joinThreadsOnCreate: true,
      presence: {
        status: "online",
        activities: [
          {
            name: `Sheweny ${
              JSON.parse(packageInfos).dependencies.sheweny.split("^")[1]
            }`,
          },
        ],
      },
      managers: {
        commands: {
          directory: "./commands",
          prefix: "!",
          applicationPermissions: true, // Slash-commands permissions
          default: {
            userPermissions: ["UseApplicationCommands"],
          }
        },
        events: {
          directory: "./events",
        },
        buttons: {
          directory: "./interactions/buttons",
        },
        selectMenus: {
          directory: "./interactions/selectMenus",
        },
      },
    });

    this.managers
      .commands!.on(
        "cooldownLimit",
        (ctx: CommandInteraction | Message): any => {
          return ctx.reply({
            content: "Please slow down",
          });
        }
      )
      .on(
        "userMissingPermissions",
        (interaction: CommandInteraction, missing: string) => {
          return interaction.reply({
            content: `You don't have ${missing} permissions`,
            ephemeral: true,
          });
        }
      );
    this.login(process.env.BOT_TOKEN);
  }
}

new Client();
