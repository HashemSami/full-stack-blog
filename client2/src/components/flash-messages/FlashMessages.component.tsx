import React, { FC, useEffect } from "react";
import Container from "../container/Container.component";

const FlashMessages: FC = () => {
  return (
    <div className="floating-alerts">
      <div className="alert alert-success test-center floating-alert shadow-sm">
        test
      </div>
    </div>
  );
};

export default FlashMessages;
