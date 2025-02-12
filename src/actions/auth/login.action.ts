"use server";
import type * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/src/shemas/auth/login.schema";
import axios from "axios";
import { UserType } from "@/src/shemas/auth/user.schema";

interface TokenInterface {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

const login = async (
  username: string,
  password: string,
): Promise<TokenInterface> => {
  const host = process.env.YABETOO_AUTH_API;
  const url = `${host}/connect/token`;

  if (
    !host ||
    !process.env.YABETOO_CLIENT_ID ||
    !process.env.YABETOO_CLIENT_SECRET
  ) {
    throw new Error("AUTH API URL not found");
  }

  return await axios
    .post(
      url,
      new URLSearchParams({
        username: username,
        password: password,
        client_id: process.env.YABETOO_CLIENT_ID,
        client_secret: process.env.YABETOO_CLIENT_SECRET,
        grant_type: "password",
      }).toString(),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    )
    .then((res) => res.data);
};

export const getUser = async (token: string): Promise<UserType> => {
  const host = process.env.YABETOO_AUTH_API;
  const url = `${host}/accounts/me`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const loginUser = async (username: string, password: string) => {
  try {
    const data = await login(username, password);
    const user = await getUser(data.access_token);

    return {
      user: user,
      token: data.access_token,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const payload = LoginSchema.safeParse(values);

  if (!payload.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { username, password } = payload.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credential. Please log in again.",
          };
        default:
          return {
            error: "An error occurred",
          };
      }
    }
    throw error;
  }
};
