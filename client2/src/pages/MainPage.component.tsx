import React, { FC } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/header/Header.componnent";
import Footer from "../components/footer/Footer.component";
import HomeGuest from "../components/home-guest/HomeGuest.component";
import About from "../components/about-us/About.component";
import Terms from "../components/terms/Terms.component";

const MainPage: FC = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomeGuest />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      <Footer />
    </>
  );
};

export default MainPage;
