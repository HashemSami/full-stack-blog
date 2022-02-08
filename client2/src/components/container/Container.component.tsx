import React, { FC, useEffect } from "react";

interface ContainerProps {
  wide?: boolean;
}

const Container: FC<ContainerProps> = ({ children, wide }) => {
  return (
    <div className={`container ${wide ? "" : "container--narrow"}  py-md-5`}>
      {children}
    </div>
  );
};

export default Container;
