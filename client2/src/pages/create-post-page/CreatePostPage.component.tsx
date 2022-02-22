import React, { FC, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

import { useActions } from "../../hooks/useActions";

import Container from "../../components/container/Container.component";
import Axios, { AxiosResponse } from "axios";

interface PostSubmit {
  title: string;
  body: string;
  token: string;
}
interface CreatePostProps {
  addFlashmessages: (msg: string) => void;
}

const CreatePostPage: FC = () => {
  usePageTitle("Create New Post");

  const { addFlashMessage } = useActions();

  const [postTitle, setPostTitle] = useState("");
  const [PostBody, setPostBody] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await Axios.post<any, any, PostSubmit>("/post/create-post", {
        title: postTitle,
        body: PostBody,
        token: localStorage.getItem("appNameToken") || "",
      });

      addFlashMessage("Congrats, you created a post.");

      // redirect to the new post URL
      navigate(`/post/${res.data}`);

      console.log("new post was created.");
    } catch (e) {
      console.log("there was a problem");
    }
  };
  return (
    <Container wide>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={e => setPostTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            onChange={e => setPostBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Container>
  );
};

export default CreatePostPage;
