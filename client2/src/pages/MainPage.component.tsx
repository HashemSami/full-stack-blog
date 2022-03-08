import React, { FC, useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { useTypedSelector } from "../hooks/useSelector";
import { useActions } from "../hooks/useActions";
import { CSSTransition } from "react-transition-group";
import { checkToken } from "../api/userApi";

import Header from "../components/header/Header.componnent";
import Footer from "../components/footer/Footer.component";
import HomePage from "./home-page/HomePage.component";
import AboutPage from "./about-page/AboutPage.component";
import TermsPage from "./terms-page/TermsPage.component";
const CreatePostPage = React.lazy(
  () => import("./create-post-page/CreatePostPage.component")
);
const ViewSinglePostPage = React.lazy(
  () => import("./view-single-post-page/ViewSinglePostPage.component")
);
const Chat = React.lazy(() => import("../components/chat/Chat.Component"));
import FlashMessages from "../components/flash-messages/FlashMessages.component";
import ProfilePage from "./profile-page/ProfilePage.component";
import EditPostPage from "./edit-post-page/EditPostPage.component";
import NotFound from "../components/not-found/NotFound.component";
import Search from "../components/search/Search.component";
import LoadingDotIcon from "../components/loading-dot-icon/LodingDotIcon.component";

const MainPage: FC = () => {
  const [flashMessages, isSearchOpen, isLoggedIn, token] = useTypedSelector(
    ({
      currentUser: { isLoggedIn, token },
      flashMessages: { flashMessages },
      search: { isSearchOpen },
    }) => [flashMessages, isSearchOpen, isLoggedIn, token]
  );

  const { logout, addFlashMessage } = useActions();

  // check if the token expired or not on first render
  useEffect(() => {
    if (isLoggedIn) {
      // send axios request here
      const [sendRequest, requestToken] = checkToken(token);

      const checkTokenRequest = async () => {
        try {
          if (sendRequest) {
            const isTokenValid = await sendRequest();

            if (!isTokenValid) {
              logout();
              addFlashMessage("You session has expired, Please log in again.");
            }
          }
        } catch (e) {
          console.log("There was a problem");
        }
      };
      checkTokenRequest();
      // cleaning after the api call to prevent memory leaks
      return () => {
        requestToken?.cancel();
      };
    }
  }, []);

  return (
    <>
      <FlashMessages flashMessages={flashMessages} />

      <Header />

      <Suspense fallback={LoadingDotIcon}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username/*" element={<ProfilePage />} />
          <Route path="/post/:id" element={<ViewSinglePostPage />} />
          <Route path="/post/:id/edit" element={<EditPostPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CSSTransition
        timeout={330}
        in={isSearchOpen}
        classNames="search-overlay"
        unmountOnExit
      >
        <Search />
      </CSSTransition>
      <Suspense fallback={<div />}>{isLoggedIn && <Chat />}</Suspense>
      <Footer />
    </>
  );
};

export default MainPage;
