import { Post, PostDb, FollowDb } from "../models";
import { ObjectId } from "mongodb";
import PostDatabase from "../data-layer/postAccess";
import FollowsDatabase from "../data-layer/followAccess";
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
    body: sanitizeHTML(postData.title.trim(), {
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
) => {
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
): Promise<string> => {
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
) => {
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

const deletePost = (
  postIdToDelete: ObjectId,
  currentUserId: ObjectId,
  postDb: PostDb
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await postDb.findBySingleId(postIdToDelete, currentUserId);
      if (post?.isVisitorOwner) {
        const res = await postDb.deletePostById(postIdToDelete);

        resolve("success");
      } else {
        reject();
      }
    } catch (e) {
      reject();
    }
  });
};
// =====================================================================

const findSingelPostById = (
  postId: ObjectId,
  visitorId: ObjectId,
  postDb: PostDb
) => {
  return new Promise(async (resolve, reject) => {
    if (typeof postId != "string" || !ObjectId.isValid(postId)) {
      reject();
      return;
    }

    try {
      const post = await postDb.findBySingleId(postId, visitorId);
      resolve(post);
    } catch {
      reject();
    }
  });
};
// =====================================================================

const findPostsByAuthorId = (authorId: ObjectId, postDb: PostDb) => {
  return new Promise(async (resolve, reject) => {
    if (typeof authorId != "string" || !ObjectId.isValid(authorId)) {
      reject();
      // to stop any further operations and exit from function
      return;
    }
    try {
      const posts = await postDb.findByAuthorId(authorId);

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
// =====================================================================

const searchPosts = (searchTerm: "string", postDb: PostDb) => {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm != "string") {
      reject();
      return;
    }
    const posts = await postDb.searchByTearm(searchTerm);
    resolve(posts);
  });
};

// =====================================================================

const countsPostsByAuthor = (authorId: ObjectId, postDb: PostDb) => {
  return new Promise(async (resolve, reject) => {
    if (typeof authorId != "string" || !ObjectId.isValid(authorId)) {
      reject();
      return;
    }
    const postsCount = await postDb.countAuthorPosts(authorId);
    resolve(postsCount);
  });
};

// =====================================================================

const getFeed = async (
  visitorId: ObjectId,
  postDb: PostDb,
  followsDB: FollowDb
) => {
  // create an array of the user ids that the current user follows
  const followedUsers = await followsDB.findFollowedUsers(visitorId);

  const followedUsersIds = followedUsers?.map(followDoc => {
    return followDoc.followedId;
  });

  // look for posts where the author is in the above array of followed users
  if (followedUsersIds) return await postDb.getFeedPosts(followedUsersIds);
};

export const post = (
  data: Post,
  userId: ObjectId,
  requestedPostId: ObjectId
) => {
  const postsDb = PostDatabase();
  const followsDb = FollowsDatabase();

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
    deletePost: (postIdToDelete: ObjectId, currentUserId: ObjectId) =>
      deletePost(postIdToDelete, currentUserId, postsDb),
    findSingelPostById: (postId: ObjectId, visitorId: ObjectId) =>
      findSingelPostById(postId, visitorId, postsDb),
    findPostsByAuthorId: (authorId: ObjectId) =>
      findPostsByAuthorId(authorId, postsDb),
    searchPosts: (searchTerm: "string") => searchPosts(searchTerm, postsDb),
    countsPostsByAuthor: (authorId: ObjectId) =>
      countsPostsByAuthor(authorId, postsDb),
    getFeed: (visitorId: ObjectId) => getFeed(visitorId, postsDb, followsDb),
  };
};
