import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  verifyUser,
} from "../Controllers/userController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";
const userRouter = new Router();
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.get("/verifyuser", verifyJwt, verifyUser);
userRouter.get("/signout", verifyJwt, signOut);
export default userRouter;
// This code defines the user routes for signing up, signing in, verifying user, and signing out.