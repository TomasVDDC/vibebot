import { bigint, integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

import { timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  userId: varchar({ length: 255 }).primaryKey(), // Clerk's user ID (e.g., user_29w83sxmDNGwOuEthce5gg56FcC)
  firstName: varchar({ length: 100 }), // Optional: User's first name
  lastName: varchar({ length: 100 }), // Optional: User's last name
  createdAt: timestamp().defaultNow().notNull(), // When user was added
  updatedAt: timestamp().defaultNow().notNull(), // When user was last updated
});

export const botsTable = pgTable("bots", {
  botId: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.userId, { onDelete: "cascade" }),
  telegramBotId: bigint({ mode: "number" }).unique().notNull(),
  botToken: varchar({ length: 255 }).unique().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const chatMessagesTable = pgTable("chat_messages", {
  messageId: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  botId: bigint({ mode: "number" })
    .notNull()
    .references(() => botsTable.botId, { onDelete: "cascade" }),
  role: varchar({ length: 50 }).notNull(), // e.g., "user" or "assistant"
  content: text().notNull(), // Message content
  messageOrder: integer().notNull(), // To maintain the order of messages
  createdAt: timestamp().defaultNow().notNull(), // When the message was created
});
