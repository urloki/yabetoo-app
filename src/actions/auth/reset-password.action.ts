"use server";
import * as Sentry from "@sentry/nextjs";

export const resetPassword = async (data: {
  password: string;
  confirmPassword: string;
  number: string;
  token: string;
}) => {
  const host = process.env.YABETOO_AUTH_API;
  const url = `${host}/accounts/resetpassword`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  console.log("Reset password data", data);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    console.log("Reset password error", err);
    Sentry.captureException(err);
    throw new Error(err);
  }

  return { success: true };
};
