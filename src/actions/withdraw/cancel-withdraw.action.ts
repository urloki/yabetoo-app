"use server";

import axios, { type AxiosError } from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const cancelWithdraw = async ({
  accountId,
  isLive,
  id,
}: {
  accountId: string;
  isLive: boolean;
  id: string;
}) => {
  const host = isLive ? process.env.PAYMENT_API_PROD : process.env.PAYMENT_API;

  const url = `${host}/v1/wallets/withdraw/cancel`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PAYMENT API URL not found");
  }

  return await axios
    .post(
      url,
      {
        id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${secret.secretValue}`,
        },
      },
    )
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error.response);
      if (error.response?.status === 422) {
        // @ts-ignore
        const code = error.response?.data?.code;
        switch (code) {
          case "E_PENDING_WITHDRAW":
            throw new Error("Vous avez déja une demande de retrait en cours");
          default:
            throw new Error(
              "An error occurred while sending the withdrawal request",
            );
        }
      }
      throw new Error("An error occurred while sending the withdrawal request");
    });
};
