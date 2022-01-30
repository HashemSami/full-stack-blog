import { getDB } from "../../../../db";
import { User, UserDb } from "../models";
import { ObjectId, Document, InsertOneResult, Collection } from "mongodb";

const UsersDatabase = (): UserDb => {
  const userCollection: Collection<User> | undefined =
    getDB()?.collection("users");
  // console.log("connection", userCollection);
  // =====================================================================
  const insertUser = async (
    userData: User
  ): Promise<InsertOneResult<Document> | undefined> => {
    try {
      return await userCollection?.insertOne(userData);
    } catch (e) {
      console.log(e);
    }
  };
  // =====================================================================
  const findByUsername = async (username: string) => {
    try {
      return await userCollection?.findOne({ username: username });
    } catch (e) {}
  };
  // =====================================================================
  const findByEmail = async (email: string) => {
    try {
      return await userCollection?.findOne({ email: email });
    } catch (e) {}
  };
  // =====================================================================
  return {
    insertUser,
    findByUsername,
    findByEmail,
  };
};

export default UsersDatabase;
