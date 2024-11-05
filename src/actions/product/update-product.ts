"use server";

import axios, { type AxiosError } from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const updateProduct = async ({
  accountId,
  id,
  data,
}: {
  accountId: string;
  id: string;
  data: FormData;
}) => {
  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/products/${id}`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  // console.log("url", data);

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
      console.log(error.response?.data);
      throw new Error("An error occurred while sending the withdrawal request");
    });
};
