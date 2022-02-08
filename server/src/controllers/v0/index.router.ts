import { Router, Request, Response } from "express";
import userRouter from "./http-routes/userRouter";

import cors from "cors";

// import { UserRouter } from './users/routes/user.router';

const router: Router = Router();

router.use(cors());
router.use("/users", userRouter);

router.get("/", async (req: Request, res: Response) => {
  res.send(`V0`);
});

export const IndexRouter: Router = router;
