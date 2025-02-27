import type { DefaultSession } from "next-auth";
import { UserType } from "@/src/shemas/auth/user.schema";

declare module "next-auth" {
  interface Session {
    user: {
      token: {
        token: string;
        expiresAt: string;
        abilities: string[];
      };
      expiresAt: string;
    } & DefaultSession["user"] &
      UserType;
  }
}
