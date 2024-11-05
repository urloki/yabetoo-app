"use server";
import { auth } from "@/auth";

interface PasswordInterface {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (data: PasswordInterface) => {
  const session = await auth();

  const host = process.env.YABETOO_AUTH_API;

  const url = `${host}/accounts/changepassword`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log("error", error);
    return {
      error: "An error occurred",
    };
  }

  return {
    success: true,
  };
};
