import React, { FC } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

import { useTypedSelector } from "../../hooks/useSelector";

import Container from "../../components/container/Container.component";
import HomeGuest from "../../components/home-guest/HomeGuest.component";

interface HomePageProps {
  loogedIn: boolean;
}

const HomePage: FC = () => {
  usePageTitle("Your Feed");

  const loogedIn = useTypedSelector(
    ({ userData: { isLoggedIn } }) => isLoggedIn
  );

  if (!loogedIn) {
    return <HomeGuest />;
  }
  return (
    <Container wide>
      <h2 className="text-center">
        Hello <strong>{localStorage.getItem("appNameUsername")}</strong>, your
        feed is empty.
      </h2>
      <p className="lead text-muted text-center">
        Your feed displays the latest posts from the people you follow. If you
        don&rsquo;t have any friends to follow that&rsquo;s okay; you can use
        the &ldquo;Search&rdquo; feature in the top menu bar to find content
        written by people with similar interests and then follow them.
      </p>
    </Container>
  );
};

export default HomePage;
