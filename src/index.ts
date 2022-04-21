import { readFileSync } from "fs";
import { join } from "path";
import type { CommandInteraction, Message } from "discord.js";
import { ShewenyClient } from "sheweny";
import toml from "toml";
import { IConfig } from "./interfaces/Config";
import dotenv from "dotenv";
dotenv.config();

const configToml = toml.parse(
  readFileSync(join(__dirname, "../config.toml")).toString()
);
const packageInfos = readFileSync(
  join(__dirname, "../package.json")
).toString();

declare module "sheweny" {
  interface ShewenyClient {
    config: IConfig;
  }
}

class Client extends ShewenyClient {
  readonly config: IConfig = configToml;

  constructor() {
    super({
      admins: configToml.bot_admins,
      intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
      partials: ["GUILD_MEMBER"],
      mode: "development",
      joinThreadsOnCreate: true,
      presence: {
        status: "online",
        activities: [
          {
            name: `Sheweny ${
              JSON.parse(packageInfos).dependencies.sheweny.split("^")[1]
            }`,
            type: "WATCHING",
          },
        ],
      },
      managers: {
        commands: {
          directory: "./commands",
          guildId: "877090306103840778", // Change with id of your guild or remote it
          prefix: "!",
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
