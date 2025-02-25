"use server";
import { auth } from "@/auth";
import { Country } from "@/src/shemas/entity/country.schema";
import axios from "axios";

export const getCountries = async (): Promise<Array<Country>> => {
  const session = await auth();
  const host = process.env.ACCOUNT_API;

  const url = `${host}/v1/countries`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err);
    });
};
