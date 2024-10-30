"use server";
import * as Sentry from "@sentry/nextjs";

export const sendPasswordResetLink = async (id: string) => {
  const host = process.env.YABETOO_AUTH_API;
  const url = `${host}/accounts/forgotpassword`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: id,
      yabetooSource: 2,
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
