import { readFileSync } from "fs";
import { join } from "path";
import { CommandInteraction } from "discord.js";
import { ShewenyClient } from "sheweny";
import { DiscordResolve } from "@sheweny/resolve";
import toml from "toml";
import { IConfig } from "./interfaces/Config";

const configToml = toml.parse(readFileSync(join(__dirname, "../config.toml")).toString());

declare module "sheweny" {
  interface ShewenyClient {
    config: IConfig;
    util: DiscordResolve;
  }
}

class Client extends ShewenyClient {
  public util: DiscordResolve;
  readonly config: IConfig = configToml;

  constructor() {
    super({
      admins: configToml.bot_admins,
      intents: ["GUILDS"],
      handlers: {
        applicationCommands: {
          directory: "./commands",
          guildId: "877090306103840778",
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

    this.util = new DiscordResolve(this);

    this.handlers
      .applicationCommands!.on("cooldownLimit", (interaction: CommandInteraction) => {
        return interaction.reply({ content: "Please slow down", ephemeral: true });
      })
      .on(
        "userMissingPermissions",
        (interaction: CommandInteraction, missing: string) => {
          return interaction.reply({
            content: `You don't have ${missing} permissions`,
            ephemeral: true,
          });
        }
      );

    this.login(this.config.token);
  }
}

new Client();
