"use server";
import * as Sentry from "@sentry/nextjs";
import axios, { AxiosError } from "axios";

interface IRegister {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export const createMerchant = async (data: IRegister) => {
  const host = process.env.ACCOUNT_API;
  const url = `${host}/v1/auth/users/create`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  return await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err: AxiosError) => {
      console.log(err?.response?.data);
      Sentry.captureException(err);
      throw new Error(
        "Une erreur est survenue lors de la création du commerçant",
      );
    });
};
