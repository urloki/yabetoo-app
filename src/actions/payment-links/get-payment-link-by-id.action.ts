"use server";


import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";
import axios from "axios";
import {PaymentLink} from "@/src/shemas/payments-link/schema";

export const getPaymentLinkByIdAction = async (
  accountId: string,
  linkId: string,
  isLive: boolean,
): Promise<PaymentLink> => {
  const host = isLive
    ? process.env.PAYMENT_LINK_API_PROD
    : process.env.PAYMENT_LINK_API;
  const url = `${host}/v1/links/${linkId}`;

  const secret = await getAccountSecret(accountId);
  if (!host) {
    throw new Error("PAYMENT LINK API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error while fetching payment links");
    });
};
