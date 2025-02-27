"use server";
import * as Sentry from "@sentry/nextjs";

export const sendPasswordResetLink = async (email: string) => {
  const host = process.env.ACCOUNT_API;
  const url = `${host}/v1/auth/users/request-password-reset`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.log("Send password reset link error", err);
    Sentry.captureException(err);
    throw new Error(err);
  }

  return { success: true };
};
