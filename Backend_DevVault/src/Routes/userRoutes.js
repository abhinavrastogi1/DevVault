import {Router} from 'express';
import { signIn, signUp } from '../Controllers/userController.js';
const userRouter=new Router();
userRouter.post('/signup',signUp);
userRouter.post('/signin',signIn);
export default userRouter;