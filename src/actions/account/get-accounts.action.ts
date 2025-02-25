"use server";
import { auth } from "@/auth";
import { Account } from "@/src/shemas/account/account.schema";
import axios from "axios";

export const getAccounts = async (): Promise<Array<Account>> => {
  const session = await auth();
  const host = process.env.ACCOUNT_API;
  const url = `${host}/v1/account/user/all`;

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
