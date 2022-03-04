import React, { FC } from "react";
import { Link } from "react-router-dom";
import Page from "../page/Page.component";

const NotFound: FC = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoop, page is not found</h2>
        <p className="lead text-muted">
          You can always visit the <Link to={"/"}>homepage</Link> to get a fresh
          start
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
