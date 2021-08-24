export interface IConfig {
  token: string;
  bot_admins: string[];
  emojis: {
    success: string;
    error: string;
    loading: string;
  };
  channels: {
    moderation_logs: string;
  };
  colors: {
    red: string;
    orange: string;
    green: string;
  };
}
