import {
  ObjectId,
  InsertOneResult,
  Document,
  ModifyResult,
  DeleteResult,
} from "mongodb";

export interface Follow {
  followedId: ObjectId;
  authorId: ObjectId;
}

export interface FollowDb {
  findByFollowedId: (followData: Follow) => Promise<Follow | null | undefined>;
  findFollowedUsers: (
    authorId: ObjectId
  ) => Promise<Follow[] | null | undefined>;
  insertFollow: (
    followData: Follow
  ) => Promise<InsertOneResult<Follow> | undefined>;
  deleteFollow: (followData: Follow) => Promise<DeleteResult | undefined>;
  getFollowers: (
    id: ObjectId
  ) => Promise<{ username: string; email: string }[] | undefined>;
  getFollowing: (id: ObjectId) => Promise<
    | {
        username: string;
        email: string;
      }[]
    | undefined
  >;
  countFollowers: (followedId: ObjectId) => Promise<number | undefined>;
  countFollowing: (authorId: ObjectId) => Promise<number | undefined>;
}
