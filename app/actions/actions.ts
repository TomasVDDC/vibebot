"use server";
import { auth } from "@clerk/nextjs/server";

import { botsTable } from "@/app/db/schema";
import db from "@/app/db";
import { revalidatePath } from "next/cache";

export async function addBot(botToken: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to add an item to your cart");
  }
  await db.insert(botsTable).values({ botToken, userId });
  // Return the updated list of todos
  //revalidatePath("/");
}
