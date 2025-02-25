"use server";
import * as Sentry from "@sentry/nextjs";

export const resetPassword = async (data: {
  newPassword: string;
  resetCode: string;
}) => {
  const host = process.env.ACCOUNT_API;
  const url = `${host}/v1/auth/users/reset-password`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  console.log("Reset password data", data);

  const response = await fetch(url, {
    method: "POST",
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
