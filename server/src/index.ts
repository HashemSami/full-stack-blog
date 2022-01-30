import { createServer } from "http";
import express, { Request, Response, Application } from "express";
import { IndexRouter } from "./controllers/v0/index.router";
import { connectToServer } from "./db";
import { MongoClient, Db } from "mongodb";

let dbConnection: Db | null = null;
const getConn = () => dbConnection;
const setConn = (dbConn: Db) => {
  dbConnection = dbConn;
};

(async () => {
  const app: Application = express();

  app.use(express.static("../client-static/public"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.set("views", "../client-static/views");
  app.set("view engine", "ejs");

  app.use("/api/v0/", IndexRouter);

  app.get("/", (req: Request, res: Response) => {
    res.render("home-guest");
  });

  const server = createServer(app);
  const port = process.env.PORT;

  await connectToServer(() => {
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  });
})();
