import { getDB } from "../../../../db";
import { Follow, FollowDb } from "../models";

import {
  ObjectId,
  Document,
  InsertOneResult,
  Collection,
  ModifyResult,
  DeleteResult,
} from "mongodb";
import { resolve } from "path/posix";

const FollowsDatabase = (): FollowDb => {
  const followCollection: Collection<Follow> | undefined =
    getDB()?.collection("follows");

  // =====================================================================

  const insertFollow = async (
    followData: Follow
  ): Promise<InsertOneResult<Follow> | undefined> => {
    return await followCollection?.insertOne({
      followedId: followData.followedId,
      authorId: new ObjectId(followData.authorId),
    });
  };
  // =====================================================================

  const findByFollowedId = async (
    followData: Follow
  ): Promise<Follow | null | undefined> => {
    return await followCollection?.findOne({
      followedId: followData.followedId,
      authorId: new ObjectId(followData.authorId),
    });
  };

  // =====================================================================

  const findFollowedUsers = async (
    authorId: ObjectId
  ): Promise<Follow[] | null | undefined> => {
    return await followCollection
      ?.find({
        authorId: new ObjectId(authorId),
      })
      .toArray();
  };
  // =====================================================================

  const deleteFollow = async (followData: Follow) => {
    return await followCollection?.deleteOne({
      followedId: followData.followedId,
      authorId: new ObjectId(followData.authorId),
    });
  };
  // =====================================================================

  const getFollowers = async (
    id: ObjectId
  ): Promise<{ username: string; email: string }[] | undefined> => {
    return await followCollection
      ?.aggregate<{ username: string; email: string }>([
        { $match: { followedId: id } },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "userDoc",
          },
        },
        {
          $project: {
            username: { $arrayElemAt: ["$userDoc.username", 0] },
            email: { $arrayElemAt: ["$userDoc.email", 0] },
          },
        },
      ])
      .toArray();
  };

  // =====================================================================

  const getFollowing = async (
    id: ObjectId
  ): Promise<{ username: string; email: string }[] | undefined> => {
    return await followCollection
      ?.aggregate<{ username: string; email: string }>([
        { $match: { authorId: id } },
        {
          $lookup: {
            from: "users",
            localField: "followedId",
            foreignField: "_id",
            as: "userDoc",
          },
        },
        {
          $project: {
            username: { $arrayElemAt: ["$userDoc.username", 0] },
            email: { $arrayElemAt: ["$userDoc.email", 0] },
          },
        },
      ])
      .toArray();
  };
  // =====================================================================
  const countFollowers = async (followedId: ObjectId) => {
    return await followCollection?.countDocuments({ followedId });
  };
  // =====================================================================
  const countFollowing = async (authorId: ObjectId) => {
    return await followCollection?.countDocuments({ authorId });
  };
  return {
    findByFollowedId,
    findFollowedUsers,
    insertFollow,
    deleteFollow,
    getFollowers,
    getFollowing,
    countFollowers,
    countFollowing,
  };
};

export default FollowsDatabase;
