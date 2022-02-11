import { Request, Response, NextFunction } from "express";
import { User } from "../data-models/models";
import { user } from "../data-models/business-logic/user";
import { post } from "../data-models/business-logic/post";
import { follow } from "../data-models/business-logic/follow";
import jwt from "jsonwebtoken";

interface CustomRequest<T> extends Request {
  body: T;
}

// how long a token lasts before expiring
const tokenLasts = "365d";

const apiMustBeLoggedIn = (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {};

const apiGetPostsByUsername = async (req: Request, res: Response) => {
  try {
    let authorDoc = await user.findByUsername(req.params.username);
    let posts = await post.findPostsByAuthorId(authorDoc._id);
    //res.header("Cache-Control", "max-age=10").json(posts)
    res.json(posts);
  } catch (e) {
    res.status(500).send("Sorry, invalid user requested.");
  }
  if (
    req.params &&
    req.params.username &&
    typeof req.params.username === "string"
  ) {
    const username = req.params.username;
  }
};

const apiRegister = async ({ body }: Request<{}, {}, User>, res: Response) => {
  try {
    const newUser = user(body);

    await newUser.register();
    const { _id, username, password, email } = newUser.getData();

    // res.json({
    //   username,
    //   password,
    //   email,
    // });

    res.json({
      token: jwt.sign({ _id, username, email }, process.env.JWTSECRET || "", {
        expiresIn: tokenLasts,
      }),
      _id,
      username,
    });
  } catch (regErrors) {
    res.status(500).send(regErrors);
  }
};

const apiLogin = async ({ body }: Request<{}, {}, User>, res: Response) => {
  try {
    const newUser = user(body);

    await newUser.login();
    const { _id, username, email } = newUser.getData();

    // res.json({
    //   username,
    //   password,
    //   email,
    // });
    // console.log(_id);
    res.json({
      token: jwt.sign({ _id, username }, process.env.JWTSECRET || "", {
        expiresIn: tokenLasts,
      }),
      username,
    });
  } catch (regErrors) {
    res.send(false);
  }
};

export default {
  apiRegister,
  apiLogin,
};
