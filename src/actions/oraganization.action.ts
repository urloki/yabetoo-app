"use server";
import { auth } from "@/auth";
import axios from "axios";
import { OrganizationType } from "@/src/shemas/organization/organization.schema";

export const getOrganizations = async (): Promise<OrganizationType[]> => {
  const session = await auth();
  const host = process.env.ACCOUNT_API;
  const url = `${host}/v1/organizations`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${session?.user.token.token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(
        "Une erreur est survenue lors de la récupération des données",
      );
    });
};
