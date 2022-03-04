import React, { FC } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

interface ContainerProps {
  wide?: boolean;
  title: string;
}

const Container: FC<ContainerProps> = ({ children, wide, title }) => {
  usePageTitle(title);
  return (
    <div className={`container ${wide ? "" : "container--narrow"}  py-md-5`}>
      {children}
    </div>
  );
};

export default Container;
