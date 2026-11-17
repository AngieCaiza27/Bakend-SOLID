import { Pool } from "pg";
import { env } from "./env";

export const dbPool = new Pool({
  host: env.dbHost || "localhost",
  port: env.dbPort || 5432,
  user: env.dbUser || "postgres",
  password: env.dbPassword || "postgres",
  database: env.dbName || "postgres"
});

export async function testDbConnection(): Promise<boolean> {
  try {
    await dbPool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("❌ Error conectando a Postgres:", error);
    return false;
  }
}
