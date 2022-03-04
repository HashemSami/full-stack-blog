import React, { FC } from "react";
import About from "../../components/about-us/About.component";
import Page from "../../components/page/Page.component";

const AboutPage: FC = () => {
  return (
    <Page title="About Us">
      <About />
    </Page>
  );
};

export default AboutPage;
