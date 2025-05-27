import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("🔄 Connecting to the database...");

export const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
  max: 10, // Maximum number of connections in the pool
  min: 1,  // Maintain at least 1 idle connection
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Wait 5s max for a new connection
  ssl: {
    rejectUnauthorized: false,
  },
});

// Optional: handle unexpected errors on pool
pool.on("error", (err) => {
  console.error("🔥 Unexpected PG pool error:", err);
});

export const connect_DB = async (retries = 3, delay = 5000) => {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1"); // Check DB is responsive
      client.release();
      console.log("📊 Pool Stats -> Total:", pool.totalCount, "| Idle:", pool.idleCount, "| Waiting:", pool.waitingCount);
      return;
    } catch (error) {
        console.error("🚫 Could not connect to the database after retries.");
        throw new Error("Error connecting to the database: " + error.message);
  }
};