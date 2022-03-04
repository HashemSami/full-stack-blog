import React, { FC } from "react";
import { Link } from "react-router-dom";
import { PostItem } from "../../models";

interface PostTitleViewProps {
  post: PostItem;
  withAuthorName?: boolean;
}

const PostTitleView: FC<PostTitleViewProps> = ({ post, withAuthorName }) => {
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} `;
  return (
    <Link
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {withAuthorName && `by ${post.author.username}`} on {dateFormatted}{" "}
      </span>
    </Link>
  );
};

export default PostTitleView;
