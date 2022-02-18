import { Request, Response, NextFunction } from "express";
import { follow } from "../data-models/business-logic/follow.logic";
import { Req } from "./models/Request";

import { ObjectId } from "mongodb";

// ==========================================================================

export const apiAddFollow = async (req: Req, res: Response) => {
  try {
    const newFollow = follow().addContent({
      followedId: new ObjectId(req.params.username),
      authorId: req.apiUser?._id,
    });

    await newFollow.createFollow(req.params.username);

    res.json(true);
  } catch (errors) {
    res.json(false);
  }
};

// ==========================================================================
export const apiRemoveFollow = async (req: Req, res: Response) => {
  try {
    const newFollow = follow().addContent({
      followedId: new ObjectId(req.params.username),
      authorId: req.apiUser?._id,
    });

    await newFollow.deleteFollow(req.params.username);

    res.json(true);
  } catch (errors) {
    res.json(false);
  }
};
