import React, { FC } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/header/Header.componnent";
import Footer from "../components/footer/Footer.component";
import HomePage from "./home-page/HomePage.component";
import AboutPage from "./about-page/AboutPage.component";
import TermsPage from "./terms-page/TermsPage.component";

const MainPage: FC = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>

      <Footer />
    </>
  );
};

export default MainPage;
