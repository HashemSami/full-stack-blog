import { Router, Request, Response } from "express";
import userControler from "../controllers/userControllers";

const userRouter: Router = Router();

userRouter.post("/register", userControler.apiRegister);
userRouter.post("/login", userControler.apiLogin);

export default userRouter;
