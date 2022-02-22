import React, { FC, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { useTypedSelector } from "../hooks/useSelector";

import Header from "../components/header/Header.componnent";
import Footer from "../components/footer/Footer.component";
import HomePage from "./home-page/HomePage.component";
import AboutPage from "./about-page/AboutPage.component";
import TermsPage from "./terms-page/TermsPage.component";
import CreatePostPage from "./create-post-page/CreatePostPage.component";
import ViewSinglePostPage from "./view-single-post-page/ViewSinglePostPage.component";
import FlashMessages from "../components/flash-messages/FlashMessages.component";

const MainPage: FC = () => {
  const flashMessages = useTypedSelector(
    ({ userData: { flashMessages } }) => flashMessages
  );

  return (
    <>
      <FlashMessages flashMessages={flashMessages} />

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<ViewSinglePostPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>

      <Footer />
    </>
  );
};

export default MainPage;
