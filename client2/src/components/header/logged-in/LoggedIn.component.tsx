import React, { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { useActions } from "../../../hooks/useActions";

import { useNavigate } from "react-router-dom";

interface LoggedOutProps {
  setLoggedIn: (bool: boolean) => void;
}

const LoggedIn: FC = () => {
  const { logout } = useActions();
  const navigate = useNavigate();

  const handleSignOut = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    logout();
    // setUserlogging(false);
    localStorage.removeItem("appNameToken");
    localStorage.removeItem("appNameUsername");
    localStorage.removeItem("appNameAvatar");
    // redirect to home guest
    navigate(`/`);
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-2">
        <img
          className="small-header-avatar"
          src={localStorage.getItem("appNameAvatar") || ""}
        />
      </a>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleSignOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default LoggedIn;
