import { Router } from "express";
import * as userControllers from "../controllers/user.controller";
import * as postControllers from "../controllers/post.controller";

const postRouter: Router = Router();

postRouter.get("/single-post/:id", postControllers.reactApiViewSingle);

postRouter.post(
  "/:id/edit",
  userControllers.apiMustBeLoggedIn,
  postControllers.apiUpdatePost
);

postRouter.post(
  "/:id/delete",
  userControllers.apiMustBeLoggedIn,
  postControllers.apiDelete
);

postRouter.post(
  "/create-post",
  userControllers.apiMustBeLoggedIn,
  postControllers.apiCreatePost
);

postRouter.post("/search", postControllers.search);

export default postRouter;
