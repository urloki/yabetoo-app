import type React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<Props> = async ({ children }) => {
  return (
    <div className="max-w-[theme(screens.3xl)] bg-background mx-auto h-screen overflow-y-scroll scroll-auto">
      {children}
    </div>
  );
};

export default DashboardLayout;
