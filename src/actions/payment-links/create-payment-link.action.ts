"use server";
import axios, { type AxiosError } from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export async function createPaymentLinkAction({
  accountId,
  data,
  isLive,
}: {
  accountId: string;
  data: FormData;
  isLive: boolean;
}) {
  const host = isLive
    ? process.env.PAYMENT_LINK_API_PROD
    : process.env.PAYMENT_LINK_API;

  const url = `${host}/v1/links`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PAYMENT LINK API URL not found");
  }

  await axios
    .post(url, data, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error.response);
      throw new Error("An error occurred while creating the link");
    });

  /*const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret.secretValue}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log("error", error);
    if (error.status === 401) {
      return {
        error: error.detail,
      };
    }
    return {
      error: "An error occurred",
    };
  }

  return {
    success: true,
  };*/
}
