import React from "react";

interface Props {
  children?: React.ReactNode;
}

const Component: React.FC<Props> = ({ children }) => {
  return <div data-component="QuickMessages">{children}</div>;
};

export default Component;
