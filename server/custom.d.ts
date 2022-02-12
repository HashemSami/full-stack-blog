declare namespace Express {
  export interface Request {
    apiUser?: string | jwt.JwtPayload;
    isFollowing?: boolean;
    profileUser?: {
      _id: string;
    };
  }
}
