import { Request, Response, NextFunction } from "express";
import { User } from "../data-models/models";
import { user } from "../data-models/business-logic/user";
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
    const { username, password, email } = newUser.getData();

    res.json({
      username,
      password,
      email,
    });

    // res.json({
    //   token: jwt.sign({ username, email }, process.env.JWTSECRET || "", {
    //     expiresIn: tokenLasts,
    //   }),
    //   username,
    // });
  } catch (regErrors) {
    res.status(500).send(regErrors);
  }
};

export default {
  apiRegister,
  apiLogin,
};
