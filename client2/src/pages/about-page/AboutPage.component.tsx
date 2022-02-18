import React, { FC } from "react";
import About from "../../components/about-us/About.component";
import { usePageTitle } from "../../hooks/usePageTitle";

const AboutPage: FC = () => {
  usePageTitle("About us");

  return <About />;
};

export default AboutPage;
