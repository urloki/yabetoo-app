"use server";

import type { z } from "zod";
import {intentSchema} from "@/src/shemas/intent/intent.schema";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";
import axios from "axios";


export const getIntentsAction = async (
  accountId: string,
  isLive: boolean,
): Promise<Array<z.infer<typeof intentSchema>>> => {
  const host = isLive ? process.env.PAYMENT_API_PROD : process.env.PAYMENT_API;

  const url = `${host}/v1/payment-intents`;

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
      throw new Error("Error getting intents");
    });
};
