import { Pool } from "pg";
export const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const connecct_DB = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database");
    client.release();
  } catch (error) {
    throw new Error("Error connecting to the database: " + error.message);
  }
};
