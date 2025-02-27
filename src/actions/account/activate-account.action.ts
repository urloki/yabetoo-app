"use server";
import { auth } from "@/auth";
import axios, { type AxiosError } from "axios";

export const activateAccountAction = async ({
  accountId,
  formData,
}: {
  accountId: string;
  formData: FormData;
}) => {
  const session = await auth();

  const host = process.env.ACCOUNT_API;

  const url = `${host}/v1/account/${accountId}/activate`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  await axios
    .post(url, formData, {
      headers: {
        Authorization: `Bearer ${session?.user?.token.token}`,
      },
    })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.error(error.message.toString());
      console.error(error.response?.data);
      throw new Error("An error occurred while activating your account");
    });
};
