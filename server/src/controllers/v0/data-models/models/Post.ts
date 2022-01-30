import {
  ObjectId,
  InsertOneResult,
  Document,
  ModifyResult,
  DeleteResult,
} from "mongodb";

export interface Post {
  _id: ObjectId;
  title: string;
  body: string;
  createdDate: Date;
  authorId: ObjectId;
  author: {
    username: string;
  };
  isVisitorOwner: boolean;
}

export interface PostDb {
  insertPost: (
    userData: Post
  ) => Promise<InsertOneResult<Document> | undefined>;
  findBySingleId: (
    id: ObjectId,
    visitorId: ObjectId
  ) => Promise<Post | undefined>;
  findByAuthorId: (authorId: ObjectId) => Promise<Post[] | undefined>;
  findOnePostAndUpdate: (
    postId: ObjectId,
    newPostData: Post
  ) => Promise<ModifyResult<Post> | undefined>;
  deletePostById: (
    postIdToDelete: ObjectId
  ) => Promise<DeleteResult | undefined>;
  searchByTearm: (searchTerm: string) => Promise<Post[] | undefined>;
  countAuthorPosts: (authorId: ObjectId) => Promise<number | undefined>;
  getFeedPosts: (followedUsers: ObjectId[]) => Promise<Post[]>;
}
