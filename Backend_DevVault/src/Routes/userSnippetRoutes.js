import { Router } from "express";
import { getAllSnippetsController, getSnippetByIdController, snippetController } from "../Controllers/snippetController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";

const snippetRouter=new Router();
snippetRouter.post("/createsnippet",verifyJwt,snippetController,getSnippetByIdController)
snippetRouter.get("/getsnippetdata",verifyJwt,getSnippetByIdController)
snippetRouter.get("/getallsnippets", verifyJwt, getAllSnippetsController);
export default snippetRouter