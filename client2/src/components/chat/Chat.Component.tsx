import React, { FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useSelector";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../models";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:8000"
);

interface StateProps {
  fieldValue: string;
  chatMessages: SocketData[];
}

const Chat: FC = () => {
  const { closeChat, addUnreadChatCount, clearUnreadChatCount } = useActions();
  const [username, avatar, token, isChatOpen] = useTypedSelector(
    ({ currentUser: { username, avatar, token }, chat: { isChatOpen } }) => [
      username,
      avatar,
      token,
      isChatOpen,
    ]
  );
  const chatInput = useRef<HTMLInputElement | null>(null);
  const chatLog = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<StateProps>({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (!chatInput.current) return;
    if (isChatOpen) {
      chatInput.current.focus();
      clearUnreadChatCount();
    }
  }, [isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (messageFromServer) => {
      setState((prevState) => ({
        ...prevState,
        chatMessages: [...prevState.chatMessages, messageFromServer],
      }));
    });
  }, []);

  useEffect(() => {
    if (!chatLog.current) return;
    if (isChatOpen) {
      chatLog.current.scrollTop = chatLog.current.scrollHeight;
    }
    if (!isChatOpen && state.chatMessages.length) {
      addUnreadChatCount();
    }
  }, [state.chatMessages]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, fieldValue: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // send message to chat server
    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token,
    });

    // add message to state collection messages
    setState((prevState) => ({
      ...prevState,
      chatMessages: [
        ...prevState.chatMessages,
        { message: state.fieldValue, username, avatar },
      ],
      fieldValue: "",
    }));
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={closeChat} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, i) => {
          if (message.username == username) {
            return (
              <div key={i} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
          return (
            <div className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>{" "}
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatInput}
          value={state.fieldValue}
          onChange={handleFieldChange}
        />
      </form>
    </div>
  );
};

export default Chat;
