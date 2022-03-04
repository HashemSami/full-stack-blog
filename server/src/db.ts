import { MongoClient, Db } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log("env:", connectionString);

const client = new MongoClient(connectionString);

let dbConnection: Db | null = null;

export const connectToServer = async (callback: () => void) => {
  try {
    // Connect the client to the server
    const db = await client.connect();

    dbConnection = db.db("HashBlogApp");

    // await dbConnection
    //   .collection("posts")
    //   .createIndex({ title: "text", body: "text" });

    // const indexes = await dbConnection.collection("posts").indexes();
    // console.log(indexes);

    console.log("Connected successfully to server");
    // console.log(dbConnection);

    return callback();
  } catch (e) {
    // Ensures that the client will close when you finish/error
    console.log("Cannot connnect to server", e);

    await client.close();
    process.exit();
  }
};

export const getDB = () => {
  return dbConnection;
};
