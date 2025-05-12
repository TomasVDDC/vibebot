// Currently the prompt is just the code that is already written in the bot-template-code.js file
// The prompt should be a description of the bot and the features that it should have
import { instructions } from "./instructions";

export const generateInitialPrompt = (botId: string) => {
  return (
    instructions +
    `import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.BOT_TOKEN_${botId};

console.log("BOT_TOKEN", botToken);
console.log("PORT", process.env.PORT);
console.log("WEBHOOK_DOMAIN", process.env.WEBHOOK_DOMAIN);

//hardcoded bot token 4
const bot = new Telegraf(botToken);

bot.on(message("text"), (ctx) => ctx.reply("Hello"));

export default bot;
`
  );
};
