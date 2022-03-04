import React, { FC, useEffect, useState } from "react";
import { useParams, NavLink, Route, Routes } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useSelector";
import { getProfileData } from "../../api/userApi";
import { addFollow, removeFollow } from "../../api/followApi";

import Page from "../../components/page/Page.component";
import ProfilePosts from "../../components/profile-posts/ProfilePosts.component";
import ProfileFollowers from "../../components/profile-followers/ProfileFollowers.component";
import ProfileFollowing from "../../components/profile-following/ProfileFollowing.component";

const ProfilePage: FC = () => {
  const { username } = useParams();
  const [token, isLoggedIn, appUsername] = useTypedSelector(
    ({ currentUser: { token, isLoggedIn, username } }) => [
      token,
      isLoggedIn,
      username,
    ]
  );

  const [state, setState] = useState({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: 0, followerCount: 0, followingCount: 0 },
    },
  });

  useEffect(() => {
    // setUserProfile(username || "", token);
    const [sendRequest, requestToken] = getProfileData(username || "", token);

    const fetchData = async () => {
      try {
        if (sendRequest) {
          const data = await sendRequest();
          if (data) {
            const { profileAvatar, profileUsername, isFollowing, counts } =
              data;
            setState({
              ...state,
              profileData: {
                profileAvatar,
                profileUsername,
                isFollowing,
                counts,
              },
            });
          }
        }
      } catch (e) {
        console.log("there was a problem");
      }
    };

    fetchData();
    return () => {
      requestToken?.cancel();
    };
  }, [username]);

  useEffect(() => {
    // setUserProfile(username || "", token);
    if (state.startFollowingRequestCount) {
      setState({ ...state, followActionLoading: true });
      const [sendRequest, requestToken] = addFollow(username || "", token);
      console.log(state.startFollowingRequestCount);
      const fetchData = async () => {
        try {
          if (sendRequest) {
            const data = await sendRequest();
            if (data) {
              setState({
                ...state,
                profileData: {
                  ...state.profileData,
                  isFollowing: true,
                  counts: {
                    ...state.profileData.counts,
                    followerCount: state.profileData.counts.followerCount + 1,
                  },
                },
                followActionLoading: false,
              });
            }
          }
        } catch (e) {
          console.log("there was a problem");
        }
      };

      fetchData();
      return () => {
        requestToken?.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    // setUserProfile(username || "", token);
    if (state.stopFollowingRequestCount) {
      setState({ ...state, followActionLoading: true });
      const [sendRequest, requestToken] = removeFollow(username || "", token);
      console.log(state.startFollowingRequestCount);
      const fetchData = async () => {
        try {
          if (sendRequest) {
            const data = await sendRequest();
            if (data) {
              setState({
                ...state,
                profileData: {
                  ...state.profileData,
                  isFollowing: false,
                  counts: {
                    ...state.profileData.counts,
                    followerCount: state.profileData.counts.followerCount - 1,
                  },
                },
                followActionLoading: false,
              });
            }
          }
        } catch (e) {
          console.log("there was a problem");
        }
      };

      fetchData();
      return () => {
        requestToken?.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState({
      ...state,
      startFollowingRequestCount: state.startFollowingRequestCount + 1,
    });
  };

  const stopFollowing = () => {
    setState({
      ...state,
      stopFollowingRequestCount: state.stopFollowingRequestCount + 1,
    });
  };

  const { profileAvatar, profileUsername, counts, isFollowing } =
    state.profileData;
  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={profileAvatar} />
        {profileUsername}
        {isLoggedIn &&
          !isFollowing &&
          appUsername != profileUsername &&
          profileUsername != "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {isLoggedIn &&
          isFollowing &&
          appUsername != profileUsername &&
          profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts:{counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<ProfilePosts />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  );
};

export default ProfilePage;
