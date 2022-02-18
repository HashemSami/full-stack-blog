import React, { FC } from "react";
import Terms from "../../components/terms/Terms.component";
import { usePageTitle } from "../../hooks/usePageTitle";

const TermsPage: FC = () => {
  usePageTitle("Our Terms");

  return <Terms />;
};

export default TermsPage;
