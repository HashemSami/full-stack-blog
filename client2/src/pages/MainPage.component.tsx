import React, { FC } from "react";
import Header from "../components/header/Header.componnent";
import Footer from "../components/footer/Footer.component";
import MainContent from "../components/home-guest/HomeGuest.component";

const MainPage: FC = () => {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  );
};

export default MainPage;
