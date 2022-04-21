module.exports = {
  apps: [
    {
      name: "sheweny-bot",
      cwd: "./dist",
      script: "node index.js",
      env: {
        NODE_ENV: "production",
        BOT_TOKEN: "lp",
      },
    },
  ],
};
