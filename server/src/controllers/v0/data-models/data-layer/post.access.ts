import { getDB } from "../../../../db";
import { PostItem, Post, PostDb } from "../models";
import { getAvatar } from "../business-logic/user.logic";

import {
  ObjectId,
  Document,
  InsertOneResult,
  Collection,
  ModifyResult,
  DeleteResult,
} from "mongodb";
// import { dbConnection } from "../../../../index";

const reusablePostQuery = (
  uniqueOperations: {}[],
  visitorId: ObjectId | "",
  finalOperation: {}[] = [],
  postsCollection: Collection<PostItem> | undefined
): Promise<Post[] | undefined> => {
  return new Promise(async (resolve, reject) => {
    const aggOperations = uniqueOperations
      .concat([
        // the lookup operator to lookup document from another collection
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "authorDocument",
          },
        },
        // the project operator to select the properties needed
        {
          $project: {
            // 1===true
            title: 1,
            body: 1,
            createdDate: 1,
            authorId: "$author",
            // because the lookup will return an array of documents
            author: { $arrayElemAt: ["$authorDocument", 0] },
          },
        },
      ])
      .concat(finalOperation);

    // the aggregate is a mongo db operation for quering data based on multiple or complex conditions,
    // we add to the aggregate function an array of object operations that need to perform to the database to let it handle the quering.
    let posts = await postsCollection?.aggregate<Post>(aggOperations).toArray();

    // clean up author property in each post object
    // like removing the password field
    posts = posts?.map(post => {
      post.isVisitorOwner = post.author._id
        ? post.author._id.equals(visitorId)
        : false;
      post.author._id = undefined;

      post.author = {
        username: post.author.username,
        avatar: getAvatar(post.author.email || ""),
      };

      return post;
    });

    resolve(posts);
  });
};

const PostDatabase = (): PostDb => {
  const postsCollection: Collection<PostItem> | undefined =
    getDB()?.collection("posts");

  // await postsCollection?.createIndex({ title: "text", body: "text" });
  // =====================================================================
  const insertPost = async (
    postData: PostItem
  ): Promise<InsertOneResult<Document> | undefined> => {
    try {
      return await postsCollection?.insertOne(postData);
    } catch (e) {
      console.log(e);
    }
  };
  // =====================================================================
  const findBySingleId = (
    id: ObjectId,
    visitorId: ObjectId
  ): Promise<Post | undefined> => {
    return new Promise(async (resolve, reject) => {
      const posts = await reusablePostQuery(
        [{ $match: { _id: id } }],
        visitorId,
        [],
        postsCollection
      );

      if (posts?.length) {
        resolve(posts[0]);
      } else {
        reject();
      }
    });
  };
  // =====================================================================
  const findByAuthorId = (authorId: ObjectId): Promise<Post[] | undefined> => {
    return new Promise(async (resolve, reject) => {
      const posts = await reusablePostQuery(
        [{ $match: { authorId: authorId } }, { $sort: { createdDate: -1 } }],
        "",
        [],
        postsCollection
      );

      resolve(posts);
    });
  };
  // =====================================================================
  const findOnePostAndUpdate = async (
    postId: ObjectId,
    newPostData: PostItem
  ): Promise<ModifyResult<PostItem> | undefined> => {
    return await postsCollection?.findOneAndUpdate(
      { _id: postId },
      { $set: { title: newPostData.title, body: newPostData.body } }
    );
  };
  // =====================================================================
  const deletePostById = async (
    postIdToDelete: ObjectId
  ): Promise<DeleteResult | undefined> => {
    return await postsCollection?.deleteOne({
      _id: postIdToDelete,
    });
  };
  // =====================================================================

  const searchByTearm = async (
    searchTerm: string
  ): Promise<Post[] | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        const posts = await reusablePostQuery(
          [{ $match: { $text: { $search: searchTerm } } }],
          "",
          [{ $sort: { score: { $meta: "textScore" } } }],
          postsCollection
        );

        resolve(posts);
      } catch (e) {
        console.log(e);
      }
    });
  };
  // =====================================================================
  const countAuthorPosts = async (authorId: ObjectId) => {
    return await postsCollection?.countDocuments({ authorId: authorId });
  };
  // =====================================================================

  const getFeedPosts = (followedUsers: ObjectId[]): Promise<PostItem[]> => {
    return new Promise(async (resolve, reject) => {
      const posts = await reusablePostQuery(
        [
          { $match: { authorId: { $in: followedUsers } } },
          { $sort: { createdDate: -1 } },
        ],
        "",
        [],
        postsCollection
      );

      resolve(posts || []);
    });
  };

  return {
    insertPost,
    findBySingleId,
    findByAuthorId,
    findOnePostAndUpdate,
    deletePostById,
    searchByTearm,
    countAuthorPosts,
    getFeedPosts,
  };
};

export default PostDatabase;
