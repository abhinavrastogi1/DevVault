import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { pool } from "../DB/index.js";
import apiError from "../Utils/apiError.js";
import jwt from "jsonwebtoken";
const genrateToken=  (userId)=>{
 const accessToken =  jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN});
 const refereshToken =  jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN});
 return {accessToken, refereshToken};
}
const isProduction = process.env.PRODUCTION === "true";
const options = {
  domain: isProduction ? ".clikn.in" : "localhost", // Change from "frontend" to "localhost"
  path: "/",
  httpOnly: true,
  secure: isProduction, // Set to true in production with HTTPS
  sameSite: isProduction ? "None" : "Lax", 
  maxAge: 24 * 60 * 60 * 1000,
};
const signUp = asyncHandler(async (req, res) => {
  const { firstName, secondName, email, password } = req?.body;
  if (!firstName || !secondName || !email || !password) {
    throw new apiError(400, "Please provide all the fields");
  }
  const user_email= email.trim();
  const user_name = firstName.trim() + " " + secondName.trim();
  const hash_password = await bcrypt.hash(password, 10);
  // Check if user already exists
  let user = await pool.query("SELECT * FROM users WHERE user_email = $1;", [user_email]);
  if (user.rows[0]) {
    throw new apiError(400, "User already exists");
  }
  user = await pool.query(
    "INSERT INTO users (user_name, user_email, hash_password) VALUES ($1, $2, $3) RETURNING *;",
    [user_name, user_email, hash_password]
  );
  console.log(user.rows[0]);
  if (!user.rows || user.rows.length === 0) {
    throw new apiError(400, "User not created");
  }
  const {accessToken, refereshToken}=genrateToken(user.rows[0].user_id)
  res
    .status(200)
    .cookie("accessToken",accessToken ,options)
    .cookie("refereshToken",refereshToken, options)
    .json(new apiResponse(200, user.rows[0], "User Successfully Created"))
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    throw new apiError(400, "Please provide all the fields");
  }
  const user_email= email.trim();
  const user = await pool.query("SELECT * FROM users WHERE user_email= $1;", [
    user_email,
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
  const {accessToken, refereshToken}=genrateToken(user.rows[0].user_id)
  res
    .status(200)
    .cookie("accessToken",accessToken ,options)
    .cookie("refereshToken",refereshToken, options)
    .json(new apiResponse(200, user.rows[0], "User Successfully signed in"));
});

export { signUp, signIn };
