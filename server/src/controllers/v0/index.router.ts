import { Router, Request, Response } from "express";
import userRouter from "./http-routes/user.router";
import postRouter from "./http-routes/post.router";
import followRouter from "./http-routes/follow.router";

import cors from "cors";

// import { UserRouter } from './users/routes/user.router';

const router: Router = Router();

router.use(cors());
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/follow", followRouter);

router.get("/", async (req: Request, res: Response) => {
  res.send(`V0`);
});

export const IndexRouter: Router = router;
