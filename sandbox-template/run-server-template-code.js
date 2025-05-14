import bot from "./bot-template-code.js";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

const domain = process.env.WEBHOOK_DOMAIN;
const webhook = await bot.createWebhook({ domain });

const server = createServer((req, res) => {
  console.log(`[INFO] Request received`);
  return webhook(req, res);
});

server.listen(process.env.PORT, () => {
  console.log(`[INFO] Server is running on port ${process.env.PORT}`);
  console.log(`[INFO] Webhook URLs:`);
  console.log(`[INFO] ${process.env.WEBHOOK_DOMAIN}`);
});
