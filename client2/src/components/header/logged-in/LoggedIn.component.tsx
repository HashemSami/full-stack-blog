import React, { FC } from "react";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useSelector";

import { useNavigate } from "react-router-dom";

interface LoggedOutProps {
  setLoggedIn: (bool: boolean) => void;
}

const LoggedIn: FC = () => {
  const { logout, openSearch, toggleChat, closeChat } = useActions();
  const navigate = useNavigate();

  const [avatar, username, isChatOpen, unreadChatCount] = useTypedSelector(
    ({ currentUser, chat: { isChatOpen, unreadChatCount } }) => [
      currentUser.avatar,
      currentUser.username,
      isChatOpen,
      unreadChatCount,
    ]
  );

  const handleSignOut = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    logout();
    // redirect to home guest
    navigate(`/`);
  };

  const handleSearchIcon = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    openSearch();
  };

  const handleChatIcon = () => {
    toggleChat();
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        href="#"
        onClick={handleSearchIcon}
        className="text-white mr-2 header-search-icon"
        data-for="search"
        data-tip="Search"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        className={
          "mr-2 header-chat-icon " +
          (unreadChatCount ? "text-danger" : "text-white")
        }
        data-for="chat"
        data-tip="Chat"
        onClick={handleChatIcon}
      >
        <i className="fas fa-comment"></i>
        {unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {unreadChatCount < 10 ? unreadChatCount : "9+"}{" "}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        to={`/profile/${username}`}
        className="mr-2"
        data-for="profile"
        data-tip="Profile"
      >
        <img className="small-header-avatar" src={avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button onClick={handleSignOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default LoggedIn;
