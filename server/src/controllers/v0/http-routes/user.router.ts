import { Router } from "express";
import * as userControllers from "../controllers/user.controller";

const userRouter: Router = Router();

// check token to log out front-end if expired
userRouter.post("/checkToken", userControllers.checkToken);

userRouter.post("/register", userControllers.apiRegister);

userRouter.post("/login", userControllers.apiLogin);

userRouter.post(
  "/get-home-feed",
  userControllers.apiMustBeLoggedIn,
  userControllers.apiGetHomeFeed
);

userRouter.post("/doesUsernameExist", userControllers.doesUsernameExist);

userRouter.post("/doesEmailExist", userControllers.doesEmailExist);

// ==========================================================================
// profile related routes
userRouter.post(
  "/profile/:username",
  userControllers.ifUserExists,
  userControllers.sharedProfileData,
  userControllers.profileBasicData
);

userRouter.get(
  "/profile/:username/posts",
  userControllers.ifUserExists,
  userControllers.apiGetPostsByUsername
);

userRouter.get(
  "/profile/:username/followers",
  userControllers.ifUserExists,
  userControllers.profileFollowers
);

userRouter.get(
  "/profile/:username/following",
  userControllers.ifUserExists,
  userControllers.profileFollowing
);

export default userRouter;
