import React, { FC, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserFollowings } from "../../api/userApi";
import { FollowersData } from "../../models";

import LoadingDotIcon from "../loading-dot-icon/LodingDotIcon.component";

const ProfileFollowing: FC = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<FollowersData[]>([]);

  useEffect(() => {
    const [sendRequest, requestToken] = getUserFollowings(username || "");

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
      {posts.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} />{" "}
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowing;
