import { Router } from "express";
import * as userControllers from "../controllers/user.controller";
import * as followControllers from "../controllers/follow.controller";

const followRouter: Router = Router();

followRouter.post(
  "/add-follow/:username",
  userControllers.apiMustBeLoggedIn,
  followControllers.apiAddFollow
);

followRouter.post(
  "/remove-follow/:username",
  userControllers.apiMustBeLoggedIn,
  followControllers.apiRemoveFollow
);

export default followRouter;
