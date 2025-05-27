import { app } from "./app.js";
import dotenv from "dotenv";
import { connect_DB } from "./DB/index.js";
import { pool } from "./DB/index.js";
dotenv.config();
const port = process.env.PORT || 3000;
const server = async () => {
  try {
    await connect_DB();
    app.get("/", (req,res) => {
      res.redirect(302,"https://clikn.in")
    });
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};
server();
