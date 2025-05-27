import { Router } from "express";
import { deleteTaskController, getAllSnippetsController, getSnippetByIdController, saveSnippetController, snippetController } from "../Controllers/snippetController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";

const snippetRouter=new Router();
snippetRouter.post("/createsnippet",verifyJwt,snippetController)
snippetRouter.get("/getsnippetdata",verifyJwt,getSnippetByIdController)
snippetRouter.get("/getallsnippets", verifyJwt, getAllSnippetsController);
snippetRouter.delete("/deletetask", verifyJwt, deleteTaskController);
snippetRouter.post("/savesnippet", verifyJwt, saveSnippetController,getAllSnippetsController);
export default snippetRouter