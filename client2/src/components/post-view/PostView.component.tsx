import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import { PostItem } from "../../models";
import { useTypedSelector } from "../../hooks/useSelector";
import { useActions } from "../../hooks/useActions";
import { deletePost } from "../../api/postApi";

interface PostViewProps {
  post: PostItem;
}

const PostView: FC<PostViewProps> = ({ post }) => {
  const navigate = useNavigate();

  const [isLoggedIn, username, token] = useTypedSelector(
    ({ currentUser: { isLoggedIn, username, token } }) => [
      isLoggedIn,
      username,
      token,
    ]
  );

  const { addFlashMessage } = useActions();

  const isOwner = () => {
    if (isLoggedIn) {
      return username == post.author.username;
    }
    return false;
  };

  const deleteHandler = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );

    if (areYouSure) {
      const [sendRequest, requestToken] = deletePost(post._id, token);
      try {
        if (sendRequest) {
          const result = await sendRequest();
          if (result == "Success") {
            // 1. display a flash message
            addFlashMessage("Post deleted successfully");

            // 2. redirect back to the current user profile
            navigate(`/profile/${username}`);
          }
        }
      } catch (e) {
        console.log("there was a problem.", e);
      }
    }
  };

  const date = new Date(post?.createdDate || "");
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} `;

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>{post?.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>
      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post?.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post?.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>
      <div className="body-content">
        <p>{post?.body}</p>
      </div>
    </>
  );
};

export default PostView;
