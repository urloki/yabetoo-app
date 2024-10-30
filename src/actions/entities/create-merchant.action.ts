"use server";
import * as Sentry from "@sentry/nextjs";
import {CreateMerchant} from "@/src/shemas/entities/create-merchant.schema";
import axios, {AxiosError} from "axios";

export const createMerchant = async (data: CreateMerchant) => {
  const host = process.env.YABETOO_ENTITY_API;
  const url = `${host}/merchants/signInStep1`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  return await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    }
  }).then(res => {
    return res.data;
  }).catch( (err : AxiosError)  => {
    console.log(err?.response?.data)
    Sentry.captureException(err);
    throw new Error("Une erreur est survenue lors de la création du commerçant")
  })

  /*const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log("Creating merchant", data);
    const err = await response.json();
    console.log("Creating merchant error", err);
    Sentry.captureException(err);
    throw new Error(err.message);
  }

  return { success: true };*/
};
