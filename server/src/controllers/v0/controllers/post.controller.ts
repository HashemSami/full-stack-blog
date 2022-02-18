import { Request, Response } from "express";
import { Post } from "../data-models/models";
import { Req } from "./models/Request";

import { post } from "../data-models/business-logic/post.logic";
import { ObjectId } from "mongodb";

// ==========================================================================
export const apiCreatePost = async (req: Req, res: Response) => {
  try {
    const postBody = req.body as Post;

    const newPost = post().addContent(postBody, req.apiUser?._id);

    const newId = await newPost.createPost();

    res.json(newId);
  } catch (errors) {
    res.json(errors);
  }
};

// ==========================================================================
export const apiUpdatePost = async (req: Req, res: Response) => {
  try {
    const postBody = req.body as Post;

    const newPost = post().addContent(
      { ...postBody, _id: new ObjectId(req.params.id) },
      req.apiUser?._id
    );

    const status = await newPost.updatePost();

    // the post was successfully updated in the database
    // or user did have permission, but there were validation errors
    res.json(status);
  } catch (errors) {
    // a post with the requested id doesn't exist
    // or if the current visitor is not the owner of the requested post
    res.json("no permissions.");
  }
};

// ==========================================================================
export const apiDelete = async (req: Req, res: Response) => {
  try {
    const status = await post().deletePost(
      new ObjectId(req.params.id),
      req.apiUser?._id
    );

    res.json(status);
  } catch (errors) {
    res.json("You do not have permission to perform that action.");
  }
};

// ==========================================================================
export const search = async (req: Request, res: Response) => {
  try {
    const posts = await post().searchPosts(req.body.searchTerm);

    res.json(posts);
  } catch (errors) {
    res.json([]);
  }
};

// ==========================================================================
export const reactApiViewSingle = async (req: Request, res: Response) => {
  try {
    const postFound = await post().findSingelPostById(
      new ObjectId(req.params.id),
      new ObjectId(0)
    );

    res.json(postFound);
  } catch (errors) {
    res.json(false);
  }
};
