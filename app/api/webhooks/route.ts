//Clerk calls this route when a user is created, in local development it calls https://ngrokurl/api/webhooks which is forwarded to localhost:3000/api/webhooks
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import db from "@/app/db";
import { usersTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    // Checks the WEBHOOK_SIGNING_SECRET env variable
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`[INFO] Received webhook with ID ${id} and event type of ${eventType}`);

    // USER CREATED
    if (evt.type === "user.created") {
      const { id: userId, first_name, last_name, created_at, updated_at } = evt.data;
      await db.insert(usersTable).values({
        userId,
        firstName: first_name,
        lastName: last_name,
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
      });
      console.log(`[INFO] User ${userId} added to database`);
    }

    // USER UPDATED
    if (evt.type === "user.updated") {
      const { id: userId, first_name, last_name, updated_at } = evt.data;
      await db
        .update(usersTable)
        .set({
          firstName: first_name,
          lastName: last_name,
          updatedAt: new Date(updated_at),
        })
        .where(eq(usersTable.userId, userId));
      console.log(`[INFO] User ${userId} updated in database`);
    }

    // USER DELETED
    if (evt.type === "user.deleted") {
      // Type assertion to ensure evt.data is of the expected type, otherwise typescript will throw an error
      const { id: userId } = evt.data as { id: string };
      await db.delete(usersTable).where(eq(usersTable.userId, userId));
      console.log(`[INFO] User ${userId} deleted from database`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error(`[ERROR] Error verifying webhook: ${err}`);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
