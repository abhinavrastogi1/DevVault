import { pool } from "../DB/index.js";
import apiError from "../Utils/apiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const verifyJwt = asyncHandler(async (req, res, next) => {
  
    const { access_token, refresh_token } = req.cookies;
    if (!access_token || !refresh_token) {
      throw new apiError(401, "Unauthorized: No access token provided");
    }
    let userExists = undefined;
    let newAccessToken = "";
    const isRefreshTokenIsSame = await pool.query(
      "SELECT refresh_token FROM  users WHERE refresh_token=$1",
      [refresh_token]
    );
    if (!isRefreshTokenIsSame.rows[0]) {
      throw new apiError(401, "Unauthorized: Invalid refresh token");
    }
    try {
      const isValidAccessToken = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      userExists = await pool.query(
        "SELECT user_id,user_name,user_email FROM users WHERE user_id=$1",
        [isValidAccessToken.user_id]
      );
    } catch (error) {
      try {
        const isValidRefreshToken = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN_SECRET_KEY
        );
        userExists = await pool.query(
          "SELECT user_id,user_name,user_email FROM users WHERE user_id=$1",
          [isValidRefreshToken.user_id]
        );
        if (!userExists.rows[0]) {
          throw new apiError(401, "Unauthorized: User does not exist");
        }
        newAccessToken = jwt.sign(
          {
            user_id: userExists?.rows[0].user_id,
            user_name: userExists?.rows[0].user_name,
            user_email: userExists?.rows[0].user_email,
          },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );
      } catch (error) {
        throw new apiError(
          401,
          "Unauthorized: Invalid access or refresh token"
        );
      }
    }
    req.user = {
      user_id: userExists.rows[0].user_id,
      user_name: userExists.rows[0].user_name,
      user_email: userExists.rows[0].user_email,
      access_token: newAccessToken,
    };
    next();
});
export default verifyJwt;
