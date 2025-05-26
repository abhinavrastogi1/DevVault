import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { errorHandler } from './Middleware/errorHandlerMiddleware.js';
import userRouter from './Routes/userRoutes.js';
import snippetRouter from './Routes/userSnippetRoutes.js';
export const app=express();
app.use(cors({ origin: process.env.CORS, credentials: true }));
app.use(express.json())
app.set("trust proxy", true);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/user",userRouter)
app.use("/snippet",snippetRouter)
app.use(errorHandler);