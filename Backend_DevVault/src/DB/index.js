import { Pool } from "pg";
console.log("Connecting to the database...  ");
import dotenv from "dotenv";
dotenv.config();
export const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const connect_DB = async (retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ Connected to the database");
      client.release();
      return;
    } catch (error) {
      console.error(`❌ Attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw new Error("Error connecting to the database: " + error.message);
      }
    }
  }
};
