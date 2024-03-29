import React, { FC } from "react";

interface FlashMessagesProps {
  flashMessages: string[];
}

const FlashMessages: FC<FlashMessagesProps> = ({ flashMessages }) => {
  return (
    <div className="floating-alerts">
      {flashMessages.map((msg, i) => {
        return (
          <div
            key={i}
            className="alert alert-success test-center floating-alert shadow-sm"
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
};

export default FlashMessages;
