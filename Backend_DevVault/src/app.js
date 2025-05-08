import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
export const app=express();
app.use(cors({ origin: process.env.CORS, credentials: true }));
app.use(express.json())
app.set("trust proxy", true);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(errorHandler);