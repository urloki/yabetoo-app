import type React from "react";
import { Locale } from "@/app.config";

type Props = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

const OnBoardingLayout: React.FC<Props> = async ({ children }) => {
  return <div className="h-screen w-full">{children}</div>;
};

export default OnBoardingLayout;
