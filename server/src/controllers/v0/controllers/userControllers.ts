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

const apiGetPostsByUsername = async (req: Request, res: Response) => {
  if (
    req.params &&
    req.params.username &&
    typeof req.params.username === "string"
  ) {
    const username = req.params.username;
    try {
      let authorDoc = await user().findByUsername(req.params.username);
      let posts = await post.findPostsByAuthorId(authorDoc._id);
      //res.header("Cache-Control", "max-age=10").json(posts)
      res.json(posts);
    } catch (e) {
      res.status(500).send("Sorry, invalid user requested.");
    }
  }
  res.status(500).send("Sorry, username is noe provided.");
};

const checkToken = (req: Request, res: Response) => {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET || "");
    res.json(true);
  } catch (e) {
    res.json(false);
  }
};

const apiMustBeLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET || "");
    next();
  } catch (e) {
    res.status(500).send("Sorry, you must provide a valid token.");
  }
};

const doesUserNameExist = (req: Request, res: Response) => {
  user()
    .findByUsername(req.body.username.toLowerCase())
    .then(function () {
      res.json(true);
    })
    .catch(function (e) {
      res.json(false);
    });
};

const doesEmailExist = async (req: Request, res: Response) => {
  // try{
  let emailBool = await user().doesEmailExist(req.body.email);
  res.json(emailBool);
  // }catch(e){
  //   res.status(500).send("Sorry, you must provide a valid token.")
  // }
};

const sharedProfileData = async (req: Request, res: Response) => {
  let viewerId;
  try {
    const viewer = jwt.verify(req.body.token, process.env.JWTSECRET || "");
    if (typeof viewer !== "string") viewerId = viewer._id;
  } catch (e) {
    viewerId = 0;
  }

  const Follow = follow();
  Follow.setFollowData({
    followedId: req.profileUser?._id,
    authorId: viewerId,
  });

  req.isFollowing = await follow().isVisitorFollowing();
};

const apiRegister = async ({ body }: Request<{}, {}, User>, res: Response) => {
  try {
    const newUser = user();

    newUser.setUserData(body);

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
    const newUser = user();

    newUser.setUserData(body);

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
  apiGetPostsByUsername,
  checkToken,
};
