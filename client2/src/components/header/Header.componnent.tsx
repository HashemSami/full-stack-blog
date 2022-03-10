import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import { useTypedSelector } from "../../hooks/useSelector";

import LoggedOut from "./logged-out/LoggedOut.component";
import LoggedIn from "./logged-in/LoggedIn.component";

interface HeaderProps {
  staticEmpty?: boolean;
}

const Header: FC<HeaderProps> = ({ staticEmpty }) => {
  const isLoggedIn = useTypedSelector(
    ({ currentUser: { isLoggedIn } }) => isLoggedIn
  );

  const headerContent = isLoggedIn ? <LoggedIn /> : <LoggedOut />;

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {!staticEmpty ? headerContent : ""}
      </div>
    </header>
  );
};

export default Header;
