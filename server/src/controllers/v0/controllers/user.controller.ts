import { Request, Response, NextFunction } from "express";
import { User } from "../data-models/models";
import { user } from "../data-models/business-logic/user.logic";
import { post } from "../data-models/business-logic/post.logic";
import { follow } from "../data-models/business-logic/follow.logic";
import { Req } from "./models/Request";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// how long a token lasts before expiring
const tokenLasts = "30d";

// ==========================================================================
export const apiGetPostsByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;

  if (req.params && req.params.username && typeof username === "string") {
    try {
      let authorDoc = await user().findByUsername(username);
      let posts = await post().findPostsByAuthorId(authorDoc._id);
      //res.header("Cache-Control", "max-age=10").json(posts)

      res.json(posts);
    } catch (e) {
      if (e == "[]") {
        res.json([]);
      } else {
        res.status(500).send("Sorry, invalid user requested.");
      }
    }
  }
};

// ==========================================================================
export const checkToken = (req: Req, res: Response) => {
  try {
    req.apiUser = jwt.verify(
      req.body.token,
      process.env.JWTSECRET || ""
    ) as jwt.JwtPayload;
    res.json(true);
  } catch (e) {
    res.json(false);
  }
};

// ==========================================================================
export const apiMustBeLoggedIn = (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  try {
    req.apiUser = jwt.verify(
      req.body.token,
      process.env.JWTSECRET || ""
    ) as jwt.JwtPayload;

    next();
  } catch (e) {
    res.status(500).send("Sorry, you must provide a valid token.");
  }
};

// ==========================================================================
export const doesUsernameExist = (req: Request, res: Response) => {
  user()
    .findByUsername(req.body.username.toLowerCase())
    .then(function () {
      res.json(true);
    })
    .catch(function (e) {
      res.json(false);
    });
};

// ==========================================================================
export const doesEmailExist = async (req: Request, res: Response) => {
  try {
    let emailBool = await user().doesEmailExist(req.body.email);
    res.json(emailBool);
  } catch (e) {
    res.status(500).send("Sorry, you must provide a valid token.");
  }
};

// ==========================================================================
export const sharedProfileData = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  let viewerId;
  try {
    const viewer = jwt.verify(req.body.token, process.env.JWTSECRET || "");
    if (typeof viewer !== "string") {
      viewerId = viewer._id;
    }
  } catch (e) {
    viewerId = 0;
  }

  if (req.profileUser) {
    const profileUserId = new ObjectId(req.profileUser._id);

    req.isFollowing = await follow().isVisitorFollowing({
      followedId: profileUserId,
      authorId: viewerId,
    });

    // console.log("profileUserId", req.isFollowing);

    try {
      let postCountPromise = post().countsPostsByAuthor(profileUserId);
      let followerCountPromise = follow().countFollowersById(profileUserId);
      let followingCountPromise = follow().countFollowingById(profileUserId);
      let [postCount, followerCount, followingCount] = await Promise.all([
        postCountPromise,
        followerCountPromise,
        followingCountPromise,
      ]);

      req.postCount = postCount;
      req.followerCount = followerCount;
      req.followingCount = followingCount;
    } catch (e) {
      console.log(e);
    }

    next();
  }
};

// ==========================================================================
export const apiRegister = async (
  { body }: Request<{}, {}, User>,
  res: Response
) => {
  try {
    const newUser = user().addContent(body);

    await newUser.register();

    const { _id, username, avatar } = newUser.getData();

    res.json({
      token: jwt.sign({ _id, username, avatar }, process.env.JWTSECRET || "", {
        expiresIn: tokenLasts,
      }),
      _id,
      username,
      avatar,
    });
  } catch (regErrors) {
    res.status(500).send(regErrors);
  }
};

// ==========================================================================
export const apiLogin = async (
  { body }: Request<{}, {}, User>,
  res: Response
) => {
  try {
    const newUser = user().addContent(body);

    await newUser.login();

    const { _id, username, avatar } = newUser.getData();

    res.json({
      token: jwt.sign({ _id, username, avatar }, process.env.JWTSECRET || "", {
        expiresIn: tokenLasts,
      }),
      username,
      avatar,
    });
  } catch (regErrors) {
    res.send(false);
  }
};

// ==========================================================================
export const apiGetHomeFeed = async (req: Req, res: Response) => {
  try {
    let posts = await post().getFeed(new ObjectId(req.apiUser?._id));

    res.json(posts);
  } catch (e) {
    res.status(500).send("Error");
  }
};

// ==========================================================================
export const ifUserExists = (req: Req, res: Response, next: NextFunction) => {
  user()
    .findByUsername(req.params.username)
    .then(function (userDocument) {
      req.profileUser = { ...userDocument, _id: userDocument._id.toString() };
      next();
    })
    .catch(function (e) {
      res.json(false);
    });
};

// ==========================================================================
export const profileBasicData = (req: Req, res: Response) => {
  res.json({
    profileUsername: req.profileUser?.username,
    profileAvatar: req.profileUser?.avatar,
    isFollowing: req.isFollowing,
    counts: {
      postCount: req.postCount,
      followerCount: req.followerCount,
      followingCount: req.followingCount,
    },
  });
};

// ==========================================================================
export const profileFollowers = async (req: Req, res: Response) => {
  try {
    let followers = await follow().getFollowersById(
      new ObjectId(req.profileUser?._id)
    );
    //res.header("Cache-Control", "max-age=10").json(followers)
    res.json(followers);
  } catch (e) {
    res.status(500).send("Error");
  }
};

// ==========================================================================
export const profileFollowing = async (req: Req, res: Response) => {
  try {
    let following = await follow().getFollowingById(
      new ObjectId(req.profileUser?._id)
    );
    //res.header("Cache-Control", "max-age=10").json(following)
    res.json(following);
  } catch (e) {
    console.log(e);

    res.status(500).send("Error");
  }
};
