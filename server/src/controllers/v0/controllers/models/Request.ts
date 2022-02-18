import jwt from "jsonwebtoken";
import { Request } from "express";

export interface Req extends Request {
  apiUser?: jwt.JwtPayload;
  isFollowing?: boolean;
  profileUser?: {
    _id: string;
    username: string;
    avatar: string;
  };
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
}
