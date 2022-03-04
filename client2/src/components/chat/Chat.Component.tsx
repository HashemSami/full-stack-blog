import React, { FC, useEffect, useRef, useState } from "react";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useSelector";

interface StateProps {
  fieldValue: string;
  chatMessages: { message: string; username: string; avatar: string }[];
}

const Chat: FC = () => {
  const { closeChat } = useActions();
  const [username, avatar, isChatOpen] = useTypedSelector(
    ({ currentUser: { username, avatar }, chat: { isChatOpen } }) => [
      username,
      avatar,
      isChatOpen,
    ]
  );
  const chatInput = useRef<HTMLInputElement | null>(null);

  const [state, setState] = useState<StateProps>({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (!chatInput.current) return;
    if (isChatOpen) {
      chatInput.current.focus();
    }
  }, [isChatOpen]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, fieldValue: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // send message to chat server

    // add message to state collection messages
    setState({
      ...state,
      chatMessages: [
        ...state.chatMessages,
        { message: state.fieldValue, username, avatar },
      ],
      fieldValue: "",
    });
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
      <div id="chat" className="chat-log">
        {state.chatMessages.map((message, i) => {
          if (message.username == username) {
            return (
              <div className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
          <div className="chat-other">
            <a href="#">
              <img
                className="avatar-tiny"
                src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
              />
            </a>
            <div className="chat-message">
              <div className="chat-message-inner">
                <a href="#">
                  <strong>barksalot:</strong>
                </a>
                Hey, I am good, how about you?
              </div>
            </div>
          </div>;
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
