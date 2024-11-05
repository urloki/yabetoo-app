"use server";



import {ProductVariant} from "@/src/shemas/product/product.schema";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";
import axios from "axios";

export const getProductVariantById = async (
  accountId: string,
  id: string,
): Promise<ProductVariant> => {
  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/products/variants/${id}`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${secret.secretValue}`,
      },
    })
    .then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error getting product variant");
    });
};
