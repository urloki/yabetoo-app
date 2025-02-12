"use server";
import { auth } from "@/auth";

interface AccountInterface {
  phoneNumber: string;
  phoneOperatorId: number;
}

export const createPayoutMethodAction = async ({
  data,
  accountId,
}: {
  data: AccountInterface;
  accountId: string;
}) => {
  const session = await auth();

  const host = process.env.ACCOUNT_API;

  const url = `${host}/v1/account/${accountId}/payout-method`;

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
