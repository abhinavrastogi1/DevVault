import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
console.log("Connecting to the database...  ");
export const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
  max: 10, // Maximum number of clients in the pool
  min: 1,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const connect_DB = async (retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    "✅ Connected to the database", pool.totalCount;
    try {
      const client = await pool.connect();
      console.log(pool.totalCount);
      await pool.query("SELECT 1");
      client.release();
      return;
    } catch (error) {
      console.error(`❌ Attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw new Error("Error connecting to the database: " + error.message);
      }
    }
  }
};
