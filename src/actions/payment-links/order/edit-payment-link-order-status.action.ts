"use server";

import axios, { type AxiosError } from "axios";
import {PaymentLinkOrder} from "@/src/shemas/payments-link/payment-link-order.schema";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const editPaymentLinkOrderStatus = async ({
  accountId,
  orderId,
  status,
}: {
  accountId: string;
  orderId: string;
  status: string;
}): Promise<PaymentLinkOrder[]> => {
  const host = process.env.PRODUCT_API;
  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  const url = `${host}/v1/payment-links/orders/${orderId}`;

  const secret = await getAccountSecret(accountId);

  return await axios
    .patch(
      url,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${secret.secretValue}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error.response);
      throw new Error("An error occurred while sending the withdrawal request");
    });
};
