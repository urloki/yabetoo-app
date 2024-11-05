"use server";
import { auth } from "@/auth";
import {Merchant} from "@/src/shemas/entity/merchant.schema";
import axios from "axios";

export const getMerchantDetail = async (): Promise<Merchant> => {
  const session = await auth();
  const host = process.env.YABETOO_ENTITY_API;
  const url = `${host}/merchants/${session?.user?.profileId}`;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
    })
    .then((res) => {
      return res.data;
    }).catch((err) => {
      console.log(err);
      throw new Error("Une erreur est survenue lors de la récupération du commerçant");
    });
};
