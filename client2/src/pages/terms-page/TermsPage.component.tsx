import React, { FC } from "react";
import Terms from "../../components/terms/Terms.component";
import Page from "../../components/page/Page.component";

const TermsPage: FC = () => {
  return (
    <Page title="Our Terms">
      <Terms />
    </Page>
  );
};

export default TermsPage;
