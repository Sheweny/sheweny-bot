import type { ColorResolvable, EmojiResolvable } from "discord.js";

export interface IConfig {
  ADMINS: string[];
  EMOTES: {
    SUCCESS: EmojiResolvable;
    ERROR: EmojiResolvable;
    LOADING: EmojiResolvable;
  };
  CHANNELS: {
    LOGS: string;
  };
  COLORS: {
    RED: ColorResolvable;
    ORANGE: ColorResolvable;
    GREEN: ColorResolvable;
  };
}
