import { Router } from "express";
import { signIn, signOut, signUp } from "../Controllers/userController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";
const userRouter = new Router();
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.get("/signout", verifyJwt, signOut);
export default userRouter;
