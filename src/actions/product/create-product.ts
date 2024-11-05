"use server";

import axios, { type AxiosError } from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const createProduct = async ({
  data,
  accountId,
}: {
  data: FormData;
  accountId: string;
}) => {
  console.log("data", data);

  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/products`;

  const secret = await getAccountSecret(accountId as string);

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }
  console.log("data", data);

  await axios
    .post(url, data, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error.response?.data);
      throw new Error("An error occurred while sending the withdrawal request");
    });
};
