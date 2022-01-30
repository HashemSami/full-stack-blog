import { getDB } from "../../../../db";
import { Post, PostDb } from "../models";

import {
  ObjectId,
  Document,
  InsertOneResult,
  Collection,
  ModifyResult,
  DeleteResult,
} from "mongodb";
import { resolve } from "path/posix";
// import { dbConnection } from "../../../../index";

const reusablePostQuery = (
  uniqueOperations: {}[],
  visitorId: ObjectId | "",
  finalOperation: {}[],
  postsCollection: Collection<Post> | undefined
): Promise<Post[] | undefined> => {
  return new Promise(async (resolve, reject) => {
    const aggOperations = uniqueOperations
      .concat([
        // the lookup operator to lookup document from another collection
        {
          $lookup: {
            from: "users",
            localField: "author",
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
      post.isVisitorOwner = post.authorId.equals(visitorId);
      // post.authorId = undefined

      post.author = {
        username: post.author.username,
      };

      return post;
    });

    resolve(posts);
  });
};

const PostDatabase = (): PostDb => {
  const postsCollection: Collection<Post> | undefined =
    getDB()?.collection("posts");

  // await postsCollection?.createIndex({ title: "text", body: "text" });
  // =====================================================================
  const insertPost = async (
    postData: Post
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
        [{ $match: { _id: new ObjectId(id) } }],
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
        [{ $match: { author: authorId } }, { $sort: { createdDate: -1 } }],
        "",
        [],
        postsCollection
      );

      if (posts?.length) {
        resolve(posts);
      } else {
        reject();
      }
    });
  };
  // =====================================================================
  const findOnePostAndUpdate = async (
    postId: ObjectId,
    newPostData: Post
  ): Promise<ModifyResult<Post> | undefined> => {
    return await postsCollection?.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: { title: newPostData.title, body: newPostData.body } }
    );
  };
  // =====================================================================
  const deletePostById = async (
    postIdToDelete: ObjectId
  ): Promise<DeleteResult | undefined> => {
    return await postsCollection?.deleteOne({
      _id: new ObjectId(postIdToDelete),
    });
  };
  // =====================================================================

  const searchByTearm = async (
    searchTerm: string
  ): Promise<Post[] | undefined> => {
    return new Promise(async (resolve, reject) => {
      const posts = await reusablePostQuery(
        [{ $match: { $text: { $search: searchTerm } } }],
        "",
        [{ $sort: { score: { $meta: "textScore" } } }],
        postsCollection
      );

      if (posts?.length) {
        resolve(posts);
      } else {
        reject();
      }
    });
  };
  // =====================================================================
  const countAuthorPosts = async (authorId: ObjectId) => {
    return await postsCollection?.countDocuments({ author: authorId });
  };
  // =====================================================================

  const getFeedPosts = (followedUsers: ObjectId[]): Promise<Post[]> => {
    return new Promise(async (resolve, reject) => {
      const posts = await reusablePostQuery(
        [
          { $match: { author: { $in: followedUsers } } },
          { $sort: { createdDate: -1 } },
        ],
        "",
        [],
        postsCollection
      );

      if (posts?.length) {
        resolve(posts);
      } else {
        reject();
      }
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
