"use client";

import { SessionProvider } from "next-auth/react";
import type React from "react";

interface Props {
  children?: React.ReactNode;
  session: unknown;
}

export const AuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};
