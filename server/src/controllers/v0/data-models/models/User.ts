import { Interface } from "readline";
import { ObjectId, InsertOneResult, Document } from "mongodb";

export interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

export interface UserDb {
  insertUser: (
    userData: User
  ) => Promise<InsertOneResult<Document> | undefined>;
  findByUsername: (username: string) => Promise<User | null | undefined>;
  findByEmail: (email: string) => Promise<User | null | undefined>;
}
