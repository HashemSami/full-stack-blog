import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PostItem } from "../../models";

import { useTypedSelector } from "../../hooks/useSelector";
import { getHomeFeed } from "../../api/userApi";

import Page from "../../components/page/Page.component";
import HomeGuest from "../../components/home-guest/HomeGuest.component";
import LoadingDotIcon from "../../components/loading-dot-icon/LodingDotIcon.component";
import PostTitleView from "../../components/post-title-view/PostTitleView.component";

interface HomePageProps {
  loogedIn: boolean;
}
interface StateProps {
  isLoading: boolean;
  feed: PostItem[];
}

const HomePage: FC = () => {
  const [loogedIn, username, token] = useTypedSelector(
    ({ currentUser: { isLoggedIn, username, token } }) => [
      isLoggedIn,
      username,
      token,
    ]
  );

  const [state, setState] = useState<StateProps>({ isLoading: true, feed: [] });

  useEffect(() => {
    // setUserProfile(username || "", token);
    const [sendRequest, requestToken] = getHomeFeed(token);

    const fetchData = async () => {
      try {
        if (sendRequest) {
          const data = await sendRequest();
          if (data) {
            setState({
              ...state,
              isLoading: false,
              feed: data,
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
  }, []);

  if (state.isLoading) return <LoadingDotIcon />;

  if (!loogedIn) {
    return <HomeGuest />;
  }
  return (
    <Page title="Your Feed" wide>
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">
            The Latest From Those You Follow.
          </h2>
          <div className="list-group">
            {state.feed.map(post => {
              return (
                <PostTitleView post={post} key={post._id} withAuthorName />
              );
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
};

export default HomePage;
