import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import LoggedOut from "./logged-out/LoggedOut.component";
import LoggedIn from "./logged-in/LoggedIn.component";

interface UserData {
  token: string;
  username: string;
}

const Header: FC = () => {
  const [loogedIn, setLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem("appNameToken"))
  );
  const [userData, setUserData] = useState<UserData>();

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {loogedIn ? (
          <LoggedIn setLoggedIn={setLoggedIn} />
        ) : (
          <LoggedOut setLoggedIn={setLoggedIn} setUserData={setUserData} />
        )}
      </div>
    </header>
  );
};

export default Header;
