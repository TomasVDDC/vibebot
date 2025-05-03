// Currently the prompt is just the code that is already written in the bot-template-code.js file
// The prompt should be a description of the bot and the features that it should have
import { instructions } from "./instructions";

export const promptStart =
  instructions +
  `import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

console.log("process.env.BOT_TOKEN_NEWBOT", process.env.BOT_TOKEN_NEWBOT);
console.log("process.env.PORT", process.env.PORT);
console.log("process.env.WEBHOOK_DOMAIN", process.env.WEBHOOK_DOMAIN);

//hardcoded bot token 4
const bot = new Telegraf(process.env.BOT_TOKEN_NEWBOT);

const domain = process.env.WEBHOOK_DOMAIN;

bot.on(message("text"), (ctx) => ctx.reply("Hello"));

const webhook = await bot.createWebhook({ domain });

const server = createServer((req, res) => {
  console.log(\`[INFO] Request received\`);
  return webhook(req, res);
});

server.listen(process.env.PORT, () => {
  console.log(\`[INFO] Server is running on port \${process.env.PORT}\`);
  console.log(\`[INFO] Webhook URLs:\`);
  console.log(\`[INFO] \${domain}\`);
});`;
