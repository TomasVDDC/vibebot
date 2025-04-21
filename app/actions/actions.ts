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

  const response = await fetch(`https://api.telegram.org/bot${botToken}/getMyName`);
  if (!response.ok) {
    return { message: "Invalid bot token. Please check your token and try again." };
  }

  let botId;
  try {
    botId = await db
      .insert(botsTable)
      .values({ botToken: botToken as string, userId })
      .returning({ botId: botsTable.botId });
  } catch (error) {
    console.error("Failed to add bot:", error);
    return { message: "Failed to add bot to database" };
  }
  redirect(`/build-bot/${botId[0].botId}`);
}

export async function getBots() {
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
  const userBots = await getBots();
  const bot = userBots.find((bot) => bot.botId === Number(botId));
  if (!bot) {
    throw new Error("Bot not found");
  }
  return bot.botToken;
}

// ----------------------- Telegram API ACTIONS -----------------------

// Get bot info
export async function getBotName(botId: string) {
  const bots = await getBots();
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
