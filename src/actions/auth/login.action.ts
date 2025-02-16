"use server";
import type * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/src/shemas/auth/login.schema";
import axios from "axios";
import { UserType } from "@/src/shemas/auth/user.schema";

const login = async (username: string, password: string) => {
  const host = process.env.ACCOUNT_API;
  const url = `${host}/v1/auth/users/login`;

  console.log("🔴 url", url);
  console.log("🔴 username", username);
  console.log("🔴 password", password);

  return await axios
    .post(
      url,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "content-type": "application/json",
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
    //const user = await getUser(data.access_token);

    return {
      user: data.user,
      token: data.token,
    };
  } catch (e) {
    console.log("🔴 e", e);
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
