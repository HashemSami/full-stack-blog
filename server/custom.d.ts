import { User } from "./src/controllers/v0/data-models/models";

declare namespace Express {
  export interface Request {
    apiUser?: string | jwt.JwtPayload;
    isFollowing?: boolean;
    profileUser?: User;
  }
}
