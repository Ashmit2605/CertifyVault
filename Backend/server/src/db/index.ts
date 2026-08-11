import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

// Database connection check
pool
  .connect()
  .then((client) => {
    console.log("✅ Database connected successfully!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
