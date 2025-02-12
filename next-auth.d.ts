import type { DefaultSession } from "next-auth";
import { UserType } from "@/src/shemas/auth/user.schema";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      session_expiry: string;
    } & DefaultSession["user"] &
      UserType;
  }
}
