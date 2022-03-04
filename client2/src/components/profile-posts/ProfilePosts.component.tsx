import React, { FC, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserPosts } from "../../api/userApi";
import { PostItem } from "../../models";

import LoadingDotIcon from "../loading-dot-icon/LodingDotIcon.component";
import PostTitleView from "../post-title-view/PostTitleView.component";

const ProfilePosts: FC = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    const [sendRequest, requestToken] = getUserPosts(username || "");

    const fetchPosts = async () => {
      try {
        if (sendRequest) {
          const posts = await sendRequest();
          setPosts(posts || []);
          setIsLoading(false);
        }
      } catch (e) {
        console.log("There was a problem");
      }
    };
    fetchPosts();
    // cleaning after the api call to prevent memory leaks
    return () => {
      requestToken?.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotIcon />;

  if (!posts.length) return <div className="list-group">no post found</div>;

  return (
    <div className="list-group">
      {posts.map(post => {
        return <PostTitleView post={post} key={post._id} />;
      })}
    </div>
  );
};

export default ProfilePosts;
