"use server";
import { auth } from "@/auth";

interface AccountInterface {
  name: string;
  countryId: number;
  organizationId: string;
}

export async function createAccount(data: AccountInterface) {
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
      Authorization: `Bearer ${session?.user?.token.token}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
