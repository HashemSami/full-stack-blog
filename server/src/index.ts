// import { createServer } from "http";
import express, { Request, Response, Application } from "express";
import { IndexRouter } from "./controllers/v0/index.router";
import { connectToServer } from "./db";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import sanitizeHTML from "sanitize-html";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./controllers/v0/sockets";
// import dotenv from "dotenv";

(async () => {
  const app: Application = express();

  app.use(express.static("../client-static/public"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // app.set("views", "../client-static/views");
  // app.set("view engine", "ejs");

  app.use("/api/v0/", IndexRouter);

  app.get("/", (req: Request, res: Response) => {
    res.render("home-guest");
  });

  // =================================================
  const server = require("http").createServer(app);

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: "http://localhost:4000",
    },
  });

  io.on("connection", function (socket) {
    socket.on("chatFromBrowser", function (data) {
      try {
        let user = jwt.verify(
          data.token,
          process.env.JWTSECRET || ""
        ) as jwt.JwtPayload;

        const messageObject = {
          message: sanitizeHTML(data.message, {
            allowedTags: [],
            allowedAttributes: {},
          }),
          username: user.username,
          avatar: user.avatar,
        };

        socket.broadcast.emit("chatFromServer", messageObject);
      } catch (e) {
        console.log("Not a valid token for chat.");
      }
    });
  });
  // =================================================

  const port = process.env.PORT;

  await connectToServer(() => {
    server.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  });
})();
