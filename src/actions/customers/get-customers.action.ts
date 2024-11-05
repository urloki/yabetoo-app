"use server";

import type { z } from "zod";
import axios from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";
import {customerSchema} from "@/src/shemas/customer/customer.schema";

export const getCustomersAction = async (
  accountId: string,
  isLive: boolean,
): Promise<Array<z.infer<typeof customerSchema>>> => {
  const host = isLive ? process.env.PAYMENT_API_PROD : process.env.PAYMENT_API;

  const secret = await getAccountSecret(accountId);

  const url = `${host}/v1/customers`;

  if (!host) {
    throw new Error("PAYMENT API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    }).then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error getting customers");
    });
};
