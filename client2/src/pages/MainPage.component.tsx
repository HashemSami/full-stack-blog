import React, { FC, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { useTypedSelector } from "../hooks/useSelector";
import { CSSTransition } from "react-transition-group";

import Header from "../components/header/Header.componnent";
import Footer from "../components/footer/Footer.component";
import HomePage from "./home-page/HomePage.component";
import AboutPage from "./about-page/AboutPage.component";
import TermsPage from "./terms-page/TermsPage.component";
import CreatePostPage from "./create-post-page/CreatePostPage.component";
import ViewSinglePostPage from "./view-single-post-page/ViewSinglePostPage.component";
import FlashMessages from "../components/flash-messages/FlashMessages.component";
import ProfilePage from "./profile-page/ProfilePage.component";
import EditPostPage from "./edit-post-page/EditPostPage.component";
import NotFound from "../components/not-found/NotFound.component";
import Search from "../components/search/Search.component";
import Chat from "../components/chat/Chat.Component";

const MainPage: FC = () => {
  const [flashMessages, isSearchOpen, isChatOpen] = useTypedSelector(
    ({
      flashMessages: { flashMessages },
      search: { isSearchOpen },
      chat: { isChatOpen },
    }) => [flashMessages, isSearchOpen, isChatOpen]
  );

  return (
    <>
      <FlashMessages flashMessages={flashMessages} />

      <Header />

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

      <CSSTransition
        timeout={330}
        in={isSearchOpen}
        classNames="search-overlay"
        unmountOnExit
      >
        <Search />
      </CSSTransition>

      <Chat />
      <Footer />
    </>
  );
};

export default MainPage;
