import { readFileSync } from "fs";
import { join } from "path";
import { CommandInteraction } from "discord.js";
import { ShewenyClient } from "sheweny";
import { DiscordResolve } from "@sheweny/resolve";
import toml from "toml";
import { IConfig } from "./interfaces/Config";

declare module "discord.js" {
  interface CommandInteraction {
    replySuccessMessage(content: string, ephemeral?: boolean): any;
    replyErrorMessage(content: string, ephemeral?: boolean): any;
  }
}

CommandInteraction.prototype.replySuccessMessage = function (
  content: string,
  ephemeral?: boolean
) {
  return this.reply({
    content: `${config.emojis.success} ${content}`,
    ephemeral: ephemeral || false,
  });
};
CommandInteraction.prototype.replyErrorMessage = function (
  content: string,
  ephemeral?: boolean
) {
  return this.reply({
    content: `${config.emojis.error} ${content}`,
    ephemeral: ephemeral || false,
  });
};

const config: IConfig = toml.parse(
  readFileSync(join(__dirname, "../config.toml")).toString()
);

class Client extends ShewenyClient {
  public util: DiscordResolve;
  readonly config = config;
  readonly colors = config.colors;

  constructor() {
    super({
      admins: config.bot_admins,
      intents: ["GUILDS", "GUILD_MEMBERS"],
      partials: ["GUILD_MEMBER"],
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

    this.handlers.applicationCommands!.on(
      "cooldownLimit",
      (interaction: CommandInteraction) => {
        return interaction.reply({
          content: "Please slow down",
          ephemeral: true,
        });
      }
    );
  }

  public initBot() {
    this.login(this.config.token);
  }
}

new Client().initBot();
