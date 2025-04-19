// Make sure to install the 'pg' package
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_LOCAL_URL!);

const result = await db.execute("select 1");

console.log(result);
export default db;
