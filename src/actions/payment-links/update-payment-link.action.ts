"use server";
import axios, { type AxiosError } from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export async function updatePaymentLinkAction({
  accountId,
  linkId,
  data,
  isLive,
}: {
  accountId: string;
  linkId: string;
  data: FormData;
  isLive: boolean;
}) {
  const host = isLive
    ? process.env.PAYMENT_LINK_API_PROD
    : process.env.PAYMENT_LINK_API;
  const url = `${host}/v1/links/${linkId}`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PAYMENT LINK API URL not found");
  }

  await axios
    .put(url, data, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error.response);
      throw new Error("An error occurred while sending the withdrawal request");
    });
}
