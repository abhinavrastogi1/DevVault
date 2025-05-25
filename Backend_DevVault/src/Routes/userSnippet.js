import { Router } from "express";
import { createSnippet } from "../Controllers/snippetController.js";

const snippetRouter=new  Router();
snippetRouter.post("/createsnippet",createSnippet)
export default snippetRouter