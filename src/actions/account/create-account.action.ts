"use server";
import { auth } from "@/auth";

interface AccountInterface {
  name: string;
  countryId: number;
}

export const createAccount = async (data: AccountInterface) => {
  const session = await auth();

  const host = process.env.ACCOUNT_API;

  const url = `${host}/v1/account/create`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};
