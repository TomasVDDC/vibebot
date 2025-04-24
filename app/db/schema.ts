import { bigint, pgTable, varchar } from "drizzle-orm/pg-core";

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
