import { Router } from "express";
import { deleteSnippetController, deleteTaskController, getAllSnippetsController, getSnippetByIdController, saveSnippetController, snippetController } from "../Controllers/snippetController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";

const snippetRouter=new Router();
snippetRouter.post("/createsnippet",verifyJwt,snippetController)
snippetRouter.get("/getsnippetdata",verifyJwt,getSnippetByIdController)
snippetRouter.get("/getallsnippets", verifyJwt, getAllSnippetsController);
snippetRouter.delete("/deletetask", verifyJwt, deleteTaskController);
snippetRouter.post("/savesnippet", verifyJwt, saveSnippetController,getAllSnippetsController);
snippetRouter.delete("/deletesnippet",verifyJwt,deleteSnippetController,getAllSnippetsController)
export default snippetRouter