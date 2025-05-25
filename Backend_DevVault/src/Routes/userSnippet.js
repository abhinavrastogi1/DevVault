import { Router } from "express";
import { createSnippet } from "../Controllers/snippetController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";

const snippetRouter=new Router();
snippetRouter.post("/createsnippet",verifyJwt,createSnippet)
export default snippetRouter