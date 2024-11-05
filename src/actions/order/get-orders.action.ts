"use server";

import type { z } from "zod";
import axios from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";
import {orderSchema} from "@/src/shemas/order/order.schema";

export const getOrdersAction = async (
  accountId: string,
): Promise<Array<z.infer<typeof orderSchema>>> => {
  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/orders`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error getting orders");
    });
};
