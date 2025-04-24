"use server";
import { auth } from "@clerk/nextjs/server";
import { botsTable } from "@/app/db/schema";
import db from "@/app/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// ----------------------- BOT ACTIONS -----------------------

export async function addBot(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const { userId } = await auth();
  if (!userId) {
    return { message: "You must be signed in to add a bot" };
  }
  const botToken = formData.get("botToken");
  if (!botToken) {
    return { message: "Bot token is required" };
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
  if (!response.ok) {
    return { message: "Invalid bot token. Please check your token and try again." };
  }

  const botData = await response.json();

  let botId;
  try {
    botId = await db
      .insert(botsTable)
      .values({ botToken: botToken as string, telegramBotId: botData.result.id, userId })
      .returning({ botId: botsTable.botId });
  } catch (error) {
    console.error("Failed to add bot:", error);
    return { message: "Failed to add bot to database" };
  }
  redirect(`/home/${botId[0].botId}`);
}

export async function getBotsDB() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get your bots");
  }
  const userBots = await db.select().from(botsTable).where(eq(botsTable.userId, userId));
  return userBots;
}

export async function getBotToken(botId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get your bots");
  }
  const userBots = await getBotsDB();
  const bot = userBots.find((bot) => bot.botId === Number(botId));
  if (!bot) {
    throw new Error("Bot not found");
  }
  return bot.botToken;
}

export async function getBotsInfo() {
  const bots = await getBotsDB();
  const botsInfo = await Promise.all(
    bots.map(async (bot) => {
      const telegramInfo = await getBotInfo(bot.botId.toString());
      return {
        ...telegramInfo,
        id: bot.botId, // This is the id of the bot in the database, replaces the telegram id
        createdAt: bot.createdAt,
      };
    })
  );
  console.log(botsInfo);
  return botsInfo;
}

// ----------------------- Telegram API ACTIONS -----------------------

// Get bot info
export async function getBotInfo(botId: string) {
  const bots = await getBotsDB();
  const bot = bots.find((bot) => bot.botId === Number(botId));
  if (!bot) {
    throw new Error("Bot not found");
  }
  const response = await fetch(`https://api.telegram.org/bot${bot.botToken}/getMe`);
  if (!response.ok) {
    throw new Error("Failed to get bot info");
  }
  const botData = await response.json();
  return botData.result;
}

// Get bot name
export async function getBotName(botId: string) {
  const bots = await getBotsDB();
  const bot = bots.find((bot) => bot.botId === Number(botId));
  if (!bot) {
    throw new Error("Bot not found");
  }

  const response = await fetch(`https://api.telegram.org/bot${bot.botToken}/getMyName`);
  if (!response.ok) {
    throw new Error("Failed to get bot name");
  }
  const botData = await response.json();
  return botData.result.name;
}

// Get bot commands
export async function getBotCommands(botId: string) {
  const bots = await getBotsDB();
  const bot = bots.find((bot) => bot.botId === Number(botId));
  if (!bot) {
    throw new Error("Bot not found");
  }
  const response = await fetch(`https://api.telegram.org/bot${bot.botToken}/getMyCommands`);
  if (!response.ok) {
    throw new Error("Failed to get bot commands");
  }
  const botData = await response.json();
  return botData.result;
}
