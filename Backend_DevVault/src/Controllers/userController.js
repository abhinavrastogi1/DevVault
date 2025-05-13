import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { pool } from "../DB/index.js";
import apiError from "../Utils/apiError.js";
const genrateToken= async (userId)=>{
const 
}


const signUp = asyncHandler(async (req, res) => {
  const { firstName, secondName, email, password } = req?.body;
  if (!firstName || !secondName || !email || !password) {
    throw new apiError(400, "Please provide all the fields");
  }
  // Check if user already exists
  let user = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
  if (user.rows[0]) {
    throw new apiError(400, "User already exists");
  }
  const user_name = firstName.trim() + " " + secondName.trim();
  const hash_password = await bcrypt.hash(password, 10);
  user = await pool.query(
    "INSERT INTO users (user_name, email, hash_password) VALUES ($1, $2, $3) RETURNING *;",
    [user_name, email, hash_password]
  );
  console.log(user.rows[0]);
  if (!user.rows || user.rows.length === 0) {
    throw new apiError(400, "User not created");
  }
  res
    .status(200)
    .json(new apiResponse(200, user.rows[0], "User Successfully Created"));
});
const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    throw new apiError(400, "Please provide all the fields");
  }
  const user = await pool.query("SELECT * FROM users WHERE email= $1;", [
    email,
  ]);
  if (!user.rows[0]) {
    throw new apiError(400, "User not found");
  }
  const isPasswordValid = await bcrypt.compare(
    password,
    user.rows[0].hash_password
  );
  if (!isPasswordValid) {
    throw new apiError(400, "Invalid Password");
  }

  res
    .status(200)
    .json(new apiResponse(200, user.rows[0], "User Successfully Logged In"));
});

export { signUp, signIn };
