"use server";


import {AccountBalance} from "@/src/shemas/account/account-balance.schema";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";
import axios from "axios";

export const getAccountBalance = async (
  accountId: string,
  isLive: boolean,
): Promise<AccountBalance> => {
  const host = isLive ? process.env.PAYMENT_API_PROD : process.env.PAYMENT_API;

  const url = `${host}/v1/wallets`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PAYMENT API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error getting account balance");
    });
};
