import { Post, PostDb, FollowDb } from "../models";
import { ObjectId } from "mongodb";
import PostDatabase from "../data-layer/post.access";
import FollowsDatabase from "../data-layer/follow.access";
import sanitizeHTML from "sanitize-html";

const cleanUp = (postData: Post, userId: ObjectId): Post => {
  if (typeof postData.title != "string") {
    postData.title = "";
  }
  if (typeof postData.body != "string") {
    postData.title = "";
  }

  return {
    _id: postData._id,
    author: postData.author,
    isVisitorOwner: postData.isVisitorOwner,
    title: sanitizeHTML(postData.title.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    body: sanitizeHTML(postData.body.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    createdDate: new Date(),
    authorId: new ObjectId(userId),
  };
};

const validate = (postData: Post, errors: (err: string) => void) => {
  if (postData.title === "") {
    errors("You must provide a title.");
  }
  if (postData.body === "") {
    errors("You must provide post content.");
  }
};
// =====================================================================

const createPost = (
  postData: Post,
  errorState: () => [string[], (err: string) => void],
  postDb: PostDb
): Promise<ObjectId | undefined> => {
  return new Promise(async (resolve, reject) => {
    const [errors, addErrors] = errorState();

    validate(postData, addErrors);

    if (!errors.length) {
      // save post into database
      try {
        const info = await postDb.insertPost(postData);

        resolve(info?.insertedId);
      } catch (e) {
        addErrors("Please try again later.");
        reject(errors);
      }
    } else {
      reject(errors);
    }
  });
};
// =====================================================================

const actuallyUpdatePost = (
  postData: Post,
  errorState: () => [string[], (err: string) => void],
  postDb: PostDb
): Promise<"success" | "failure"> => {
  return new Promise(async (resolve, reject) => {
    const [errors, addErrors] = errorState();
    validate(postData, addErrors);
    if (!errors.length) {
      const res = await postDb.findOnePostAndUpdate(postData._id, postData);
      if (res?.ok) {
        resolve("success");
      } else {
        resolve("failure");
      }
    }
  });
};

const updatePost = (
  postData: Post,
  errorState: () => [string[], (err: string) => void],
  postDb: PostDb
): Promise<"success" | "failure"> => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await postDb.findBySingleId(postData._id, postData.authorId);
      if (post?.isVisitorOwner) {
        // actually update the db
        const status = await actuallyUpdatePost(postData, errorState, postDb);
        resolve(status);
      } else {
        reject();
      }
    } catch (e) {
      reject();
    }
  });
};

// =====================================================================
const countsPostsByAuthor = (
  authorId: ObjectId,
  postDb: PostDb
): Promise<number | undefined> => {
  return new Promise(async (resolve, reject) => {
    if (typeof authorId != "string" || !ObjectId.isValid(authorId)) {
      reject();
      return;
    }
    const postsCount = await postDb.countAuthorPosts(authorId);
    resolve(postsCount);
  });
};

// ====================================================================

// Attached Functions

const findPostsByAuthorId = (authorId: ObjectId, postsDb: PostDb) => {
  return new Promise(async (resolve, reject) => {
    if (typeof authorId != "string" || !ObjectId.isValid(authorId)) {
      reject();
      // to stop any further operations and exit from function
      return;
    }
    try {
      const posts = await postsDb.findByAuthorId(authorId);

      if (posts?.length) {
        resolve(posts);
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

// ===================================================================================
const findSingelPostById = (
  postId: ObjectId,
  visitorId: ObjectId,
  postsDb: PostDb
) => {
  // const postsDb = PostDatabase();

  return new Promise(async (resolve, reject) => {
    if (typeof postId != "string" || !ObjectId.isValid(postId)) {
      reject();
      return;
    }

    try {
      const post = await postsDb.findBySingleId(postId, visitorId);
      resolve(post);
    } catch {
      reject();
    }
  });
};

// ===================================================================================
const deletePost = (
  postIdToDelete: ObjectId,
  currentUserId: ObjectId,
  postsDb: PostDb
): Promise<"success"> => {
  // const postsDb = PostDatabase();

  return new Promise(async (resolve, reject) => {
    try {
      const post = await postsDb.findBySingleId(postIdToDelete, currentUserId);
      if (post?.isVisitorOwner) {
        const res = await postsDb.deletePostById(postIdToDelete);

        resolve("success");
      } else {
        reject();
      }
    } catch (e) {
      reject();
    }
  });
};

// ===================================================================================

const searchPosts = (
  searchTerm: string,
  postsDb: PostDb
): Promise<Post[] | undefined> => {
  // const postsDb = PostDatabase();

  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm != "string") {
      reject();
      return;
    }
    const posts = await postsDb.searchByTearm(searchTerm);
    resolve(posts);
  });
};

const getFeed = async (
  visitorId: ObjectId,
  postDb: PostDb
  // followsDB: FollowDb
) => {
  // const postsDb = PostDatabase();

  const followsDB = FollowsDatabase();
  // create an array of the user ids that the current user follows
  const followedUsers = await followsDB.findFollowedUsers(visitorId);

  const followedUsersIds = followedUsers?.map((followDoc) => {
    return followDoc.followedId;
  });

  // look for posts where the author is in the above array of followed users
  if (followedUsersIds) return await postDb.getFeedPosts(followedUsersIds);
};

// =====================================================================
const addContent = (data: Post, userId: ObjectId, postsDb: PostDb) => {
  const postData = cleanUp(data, userId);
  const getPostData = () => postData;
  const PostState = (): [Post, (newData: Post) => void] => {
    const setPostData = (newData: Post) => {
      Object.assign(postData, newData);
    };

    return [postData, setPostData];
  };

  const errors: string[] = [];
  const errorState = (): [string[], (err: string) => void] => {
    const addError = (err: string) => {
      errors.push(err);
    };

    return [errors, addError];
  };

  return {
    createPost: () => createPost(postData, errorState, postsDb),
    updatePost: () => updatePost(postData, errorState, postsDb),
  };
};

export const post = () => {
  const postsDb = PostDatabase();

  return {
    addContent: (data: Post, userId: ObjectId) =>
      addContent(data, userId, postsDb),

    countsPostsByAuthor: (authorId: ObjectId) =>
      countsPostsByAuthor(authorId, postsDb),

    findPostsByAuthorId: (authorId: ObjectId) =>
      findPostsByAuthorId(authorId, postsDb),

    findSingelPostById: (postId: ObjectId, visitorId: ObjectId) =>
      findSingelPostById(postId, visitorId, postsDb),

    searchPosts: (searchTerm: string) => searchPosts(searchTerm, postsDb),

    deletePost: (postIdToDelete: ObjectId, currentUserId: ObjectId) =>
      deletePost(postIdToDelete, currentUserId, postsDb),

    getFeed: (visitorId: ObjectId) => getFeed(visitorId, postsDb),
  };
};
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
