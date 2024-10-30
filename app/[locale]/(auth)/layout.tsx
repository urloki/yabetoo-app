import type React from "react";
import {Locale} from "@/app.config";

type Props = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

const DashboardLayout: React.FC<Props> = async ({ children }) => {
  return (
    <div className="max-w-screen-3xl mx-auto h-screen overflow-y-scroll scroll-auto bg-background">
      {children}
    </div>
  );
};

export default DashboardLayout;
