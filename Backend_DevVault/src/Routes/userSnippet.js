import { Router } from "express";
import { snippetController } from "../Controllers/snippetController.js";
import verifyJwt from "../Middleware/verifyJwtMiddleware.js";

const snippetRouter=new Router();
snippetRouter.post("/createsnippet",verifyJwt,snippetController)
export default snippetRouter