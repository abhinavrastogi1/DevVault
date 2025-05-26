import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { pool } from "../DB/index.js";
import apiError from "../Utils/apiError.js";
import jwt from "jsonwebtoken";
const isProduction = process.env.PRODUCTION === "true";
const genrateToken = (user_id, user_name, user_email) => {
  const access_token = jwt.sign(
    { user_id, user_name, user_email },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
  const refresh_token = jwt.sign(
    { user_id, user_name, user_email },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
  return { access_token, refresh_token };
};
export const options = {
  domain: isProduction ? ".clikn.in" : "localhost", // Change from "frontend" to "localhost"
  path: "/",
  httpOnly: true,
  secure: isProduction, // Set to true in production with HTTPS
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 24 * 60 * 60 * 1000,
};
const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req?.body;

  if (!name || !email || !password) {
    throw new apiError(400, "Please provide all the fields");
  }
  const user_email = email.trim();
  const user_name = name.trim();
  const hash_password = await bcrypt.hash(password, 10);
  // Check if user already exists
  let user = await pool.query("SELECT * FROM users WHERE user_email = $1;", [
    user_email,
  ]);
  if (user.rows[0]) {
    throw new apiError(400, "User already exists");
  }
  user = await pool.query(
    "INSERT INTO users (user_name, user_email, hash_password) VALUES ($1, $2, $3) RETURNING user_id,user_name,user_email;",
    [user_name, user_email, hash_password]
  );
  if (!user.rows || user.rows.length === 0) {
    throw new apiError(400, "User not created");
  }
  const userData = user.rows[0];
  const { access_token, refresh_token } = genrateToken(
    userData.user_id,
    userData.user_email,
    userData.user_name
  );
  const addRefreshToken = await pool.query(
    "UPDATE users SET refresh_token= $1 WHERE user_id=$2 RETURNING user_id,user_name,user_email,refresh_token;",
    [refresh_token, userData.user_id]
  );
  if (!addRefreshToken?.rows[0]?.refresh_token) {
    throw new apiError(400, "Refresh token not added");
  }
  res
    .status(200)
    .cookie("access_token", access_token, options)
    .cookie("refresh_token", refresh_token, options)
    .json(new apiResponse(200, user.rows[0], "User Successfully Created"));
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    throw new apiError(400, "Please provide all the fields");
  }
  const user_email = email.trim();
  const user = await pool.query(
    "SELECT user_id, user_name, user_email ,hash_password FROM users WHERE user_email = $1;",
    [user_email]
  );
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
  const userData = {
    user_id: user.rows[0].user_id,
    user_email: user.rows[0].user_email,
    user_name: user.rows[0].user_name,
  };
  const { access_token, refresh_token } = genrateToken(
    userData.user_id,
    userData.user_email,
    userData.user_name
  );
  const addRefreshToken = await pool.query(
    "UPDATE users SET refresh_token= $1 WHERE user_id=$2 RETURNING user_id,user_name,user_email,refresh_token;",
    [refresh_token, userData.user_id]
  );
  if (!addRefreshToken?.rows[0]?.refresh_token) {
    throw new apiError(400, "Refresh token not added");
  }
  res
    .status(200)
    .cookie("access_token", access_token, options)
    .cookie("refresh_token", refresh_token, options)
    .json(new apiResponse(200, userData, "User Successfully signed in"));
});

const signOut = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  if (!user_id) {
    throw new apiError(400, "all fields are required ");
  }
  const user = await pool.query(
    "SELECT user_id FROM users WHERE user_id = $1;",
    [user_id]
  );
  if (!user.rows[0]) {
    throw new apiError(400, "User not found");
  }
  const removeRefreshToken = await pool.query(
    "UPDATE users SET refresh_token=NULL WHERE user_id=$1 RETURNING user_id,refresh_token;",
    [user_id]
  );
  if (
    !removeRefreshToken?.rows[0] ||
    removeRefreshToken?.rows[0]?.refresh_token !== null
  ) {
    throw new apiError(400, "User not signed out");
  }
  res
    .clearCookie("access_token", "", options)
    .clearCookie("refresh_token", "", options)
    .json(new apiResponse(200, {}, "User Successfully signed out"));
});
const verifyUser = asyncHandler(async (req, res) => {
  const { user_id, access_token } = req.user;
  if (!user_id) {
    throw new apiError(400, "User not found");
  }
  const user = await pool.query(
    "SELECT user_id, user_name, user_email FROM users WHERE user_id = $1;",
    [user_id]
  );
  if (!user.rows[0]) {
    throw new apiError(400, "User not found");
  }
  if (access_token) {
    res
      .status(200)
      .json(new apiResponse(200, user.rows[0], "User verified successfully"))
      .cookie("access_token", access_token, options);
  }
  res
    .status(200)
    .json(new apiResponse(200, user.rows[0], "User verified successfully"));
});
export { signUp, signIn, signOut ,verifyUser};
