"use server";


import {ProductVariant} from "@/src/shemas/product/product.schema";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const addProductVariant = async ({
  payload,
  accountId,
}: {
  payload: ProductVariant;
  accountId: string;
}) => {
  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/products/variants`;

  const secret = await getAccountSecret(accountId as string);

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret.secretValue}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log("error", error);
    if (error.status === 401) {
      return {
        error: error.detail,
      };
    }
    return {
      error: "An error occurred",
    };
  }

  return {
    success: true,
  };
};
