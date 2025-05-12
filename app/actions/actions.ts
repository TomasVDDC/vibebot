"use server";
import { auth } from "@clerk/nextjs/server";
import { botsTable, chatMessagesTable, botCodeTable } from "@/app/db/schema";
import db from "@/app/db";
import { eq, sql, asc, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Message } from "@/lib/messages";
import { Sandbox } from "@e2b/code-interpreter";

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

export async function deleteBot(botId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to delete a bot");
  }
  try {
    await db.delete(botsTable).where(eq(botsTable.botId, Number(botId)));
  } catch (error) {
    console.error("Failed to delete bot:", error);
    throw new Error("Failed to delete bot");
  }
  redirect("/home");
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
  const botCommands = await response.json();
  return botCommands.result;
}

// Get bot description
export async function getBotDescription(botId: string) {
  const bots = await getBotsDB();
  const bot = bots.find((bot) => bot.botId === Number(botId));
  if (!bot) {
    throw new Error("Bot not found");
  }
  const response = await fetch(`https://api.telegram.org/bot${bot.botToken}/getMyDescription`);
  if (!response.ok) {
    throw new Error("Failed to get bot description");
  }
  const botDescription = await response.json();
  return botDescription.result.description;
}

// ----------------------- CHAT ACTIONS -----------------------

async function getNextMessageOrder(botId: number): Promise<number> {
  const result = await db
    .select({
      maxOrder: sql<number | null>`MAX(${chatMessagesTable.messageOrder})`,
    })
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.botId, botId));

  return (result[0].maxOrder ?? 0) + 1;
}

export async function addChatMessage(botId: string, role: string, content: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to add a chat message");
  }
  let messageId;
  try {
    const messageOrder = await getNextMessageOrder(Number(botId));
    const message = await db
      .insert(chatMessagesTable)
      .values({ botId: Number(botId), role, content, messageOrder })
      .returning({ messageId: chatMessagesTable.messageId });
    messageId = message[0].messageId;
  } catch (error) {
    console.error("Failed to add chat message:", error);
  }
  return messageId!;
}

export async function getChatHistory(botId: string): Promise<Message[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get chat history");
  }
  return db
    .select({
      role: chatMessagesTable.role,
      content: chatMessagesTable.content,
    })
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.botId, Number(botId)))
    .orderBy(asc(chatMessagesTable.messageOrder));
}

// ----------------------- BOTCODE ACTIONS -----------------------

export async function addBotCode(botId: string, messageId: number, code: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to add a bot code");
  }
  await db.insert(botCodeTable).values({ botId: Number(botId), messageId: messageId ?? null, code });
}

export async function getLatestBotCode(botId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get a bot code");
  }

  const botCode = await db
    .select({ code: botCodeTable.code })
    .from(botCodeTable)
    .where(eq(botCodeTable.botId, Number(botId)))
    .orderBy(desc(botCodeTable.createdAt))
    .limit(1);

  return botCode[0]?.code ?? "";
}

// ----------------------- SANDBOX ACTIONS -----------------------

export async function getSandboxStatus(botId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get the sandbox status");
  }

  const runningSandboxes = await Sandbox.list();

  const sbx = runningSandboxes.find((sandbox) => sandbox.metadata?.botId === botId);

  if (!sbx) {
    return { status: "not running" };
  }
  return { status: "running" };
}

// ----------------------- DEPLOY ACTIONS -----------------------

export async function deployBot(botId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to deploy a bot");
  }

  const headersGithub = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const headersRender = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.RENDER_PAT}`,
  };

  const renderEnvGroupId = process.env.RENDER_ENV_GROUP_ID;

  const code = await getLatestBotCode(botId);
  const botToken = await getBotToken(botId);

  async function writeNewBotToGithub(botId: string, code: string) {
    const base64Code = Buffer.from(code).toString("base64");

    //sha ensures that we are updating the correct version of the file
    const responseSha = await fetch(process.env.GITHUB_REPO_URL + `bot-id-${botId}.js`, {
      method: "GET",
      headers: headersGithub,
    });
    const data = await responseSha.json();
    const sha = data.sha;

    const responseGithub = await fetch(process.env.GITHUB_REPO_URL + `bot-id-${botId}.js`, {
      method: "PUT",
      headers: headersGithub,
      body: JSON.stringify({ message: "new bot", content: base64Code, sha }),
    });
    if (!responseGithub.ok) {
      console.error(`[ERROR] Failed to write new bot to GitHub: ${responseGithub.statusText}`);
      throw new Error("Failed to write new bot to GitHub");
    }
    console.log(`[INFO] Successfully wrote ${botId} to github`);
  }

  async function addNewEnvVarToRender(envVarName: string, envVarValue: string) {
    const responseRender = await fetch(`https://api.render.com/v1/env-groups/${renderEnvGroupId}/env-vars/${envVarName}`, {
      method: "PUT",
      headers: headersRender,
      body: JSON.stringify({ value: envVarValue }),
    });
    if (!responseRender.ok) {
      console.error(`[ERROR] Failed to add new env var to Render: ${responseRender.statusText}`);
      throw new Error("Failed to add new env var to Render");
    }
    console.log(`[INFO] Successfully added ${envVarName} to render`);
  }
  // The bot token will probably be pulled from a db in the future
  addNewEnvVarToRender(`BOT_TOKEN_${botId}`, botToken);
  writeNewBotToGithub(botId, code);
}
