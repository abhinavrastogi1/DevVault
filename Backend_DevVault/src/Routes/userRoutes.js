import {Router} from 'express';
import { signUp } from '../Controllers/userController.js';
const userRouter=new Router();
userRouter.post('/signup',signUp);
export default userRouter;