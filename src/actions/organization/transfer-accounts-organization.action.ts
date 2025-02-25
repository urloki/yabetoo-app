"use server";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";

export async function transferAccountsOrganization(organizationId: string) {
  const session = await auth();

  const host = process.env.ACCOUNT_API;

  if (!host) {
    throw new Error("API URL not found");
  }

  const url = `${host}/v1/organizations/${organizationId}/accounts/transfer-all`;

  return await axios
    .post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token.token}`,
        },
      },
    )
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.error(error.message.toString());
      console.error(error.response?.data);
      throw new Error("An error occurred while creating the organization");
    });
}
