// Make sure to install the 'pg' package
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// If Vercel is equal to 1 use the production database, otherwise use the local database
const db = process.env.VERCEL === "1" ? drizzle(process.env.DATABASE_PROD_URL!) : drizzle(process.env.DATABASE_LOCAL_URL!);

export default db;
