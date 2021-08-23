import { readFileSync } from "fs";
import { join } from "path";
import { CommandInteraction } from "discord.js";
import { ShewenyClient } from "sheweny";
import { DiscordResolve } from "@sheweny/resolve";
import toml from "toml";

declare module "discord.js" {
  interface CommandInteraction {
    replySuccessMessage(content: string): any;
    replyErrorMessage(content: string): any;
  }
}

CommandInteraction.prototype.replySuccessMessage = function (content: string) {
  return this.reply(`${config.emojis.success} ${content}`);
};
CommandInteraction.prototype.replyErrorMessage = function (content: string) {
  return this.reply(`${config.emojis.error} ${content}`);
};

const config = toml.parse(
  readFileSync(join(__dirname, "../config.toml")).toString()
);

class Client extends ShewenyClient {
  util: DiscordResolve;
  constructor() {
    super({
      admins: config.bot_admins,
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
  }
  config = config;
  colors = config.colors;
}
const client = new Client();
client.login(client.config.token);
