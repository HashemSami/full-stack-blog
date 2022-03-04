import {
  ObjectId,
  InsertOneResult,
  Document,
  ModifyResult,
  DeleteResult,
} from "mongodb";

export interface PostItem {
  _id: ObjectId;
  title: string;
  body: string;
  createdDate: Date;
  authorId: ObjectId;
}

export interface Post {
  _id: ObjectId;
  title: string;
  body: string;
  createdDate: Date;
  authorId: ObjectId;
  author: {
    _id?: ObjectId | undefined;
    username: string;
    avatar: string;
    email?: string;
  };
  isVisitorOwner: boolean;
}

export interface PostDb {
  insertPost: (
    userData: PostItem
  ) => Promise<InsertOneResult<Document> | undefined>;
  findBySingleId: (
    id: ObjectId,
    visitorId: ObjectId
  ) => Promise<Post | undefined>;
  findByAuthorId: (authorId: ObjectId) => Promise<Post[] | undefined>;
  findOnePostAndUpdate: (
    postId: ObjectId,
    newPostData: PostItem
  ) => Promise<ModifyResult<PostItem> | undefined>;
  deletePostById: (
    postIdToDelete: ObjectId
  ) => Promise<DeleteResult | undefined>;
  searchByTearm: (searchTerm: string) => Promise<Post[] | undefined>;
  countAuthorPosts: (authorId: ObjectId) => Promise<number | undefined>;
  getFeedPosts: (followedUsers: ObjectId[]) => Promise<PostItem[]>;
}
