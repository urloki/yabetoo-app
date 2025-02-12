import type React from "react";
import { Locale } from "@/app.config";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

const AdminLayout: React.FC<Props> = async ({ children }) => {
  const session = await auth();
  if (!session?.user.roles.includes("admin")) {
    redirect("/");
  }

  console.log("session admin", session);
  return <div className="h-screen w-full bg-white">{children}</div>;
};

export default AdminLayout;
