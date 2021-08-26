import type { ColorResolvable, EmojiResolvable } from "discord.js";

export interface IConfig {
  token: string;
  bot_admins: string[];
  emojis: {
    success: EmojiResolvable;
    error: EmojiResolvable;
    loading: EmojiResolvable;
  };
  channels: {
    moderation_logs: string;
  };
  colors: {
    red: ColorResolvable;
    orange: ColorResolvable;
    green: ColorResolvable;
  };
}
