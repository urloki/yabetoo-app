"use server";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";

interface CreateOrganizationData {
  name: string;
  countryId: number;
  description?: string;
}

export async function createOrganization(data: CreateOrganizationData) {
  const session = await auth();

  const host = process.env.ACCOUNT_API;

  if (!host) {
    throw new Error("API URL not found");
  }

  const url = `${host}/v1/organizations`;

  console.log("data", data);

  return await axios
    .post(url, data, {
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
      throw new Error("An error occurred while creating the organization");
    });
}
