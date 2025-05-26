import { Router } from "express";
import { getSnippetByIdController, snippetController } from "../Controllers/snippetController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";

const snippetRouter=new Router();
snippetRouter.post("/createsnippet",verifyJwt,snippetController,getSnippetByIdController)
snippetRouter.get("/getsnippetdata",verifyJwt,getSnippetByIdController)
export default snippetRouter