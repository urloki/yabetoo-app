"use server";

import axios, { type AxiosError } from "axios";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const resendWithdrawOtp = async ({
  accountId,
  isLive,
}: {
  accountId: string;
  isLive: boolean;
}) => {
  const host = isLive ? process.env.PAYMENT_API_PROD : process.env.PAYMENT_API;

  const url = `${host}/v1/wallets/withdraw/otp/resend`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PAYMENT API URL not found");
  }

  return await axios
    .post(
      url,
      {},
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
