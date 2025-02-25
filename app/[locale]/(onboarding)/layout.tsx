import type React from "react";

type Props = {
  children: React.ReactNode;
};

const OnBoardingLayout: React.FC<Props> = async ({ children }) => {
  return <div className="h-screen w-full">{children}</div>;
};

export default OnBoardingLayout;
