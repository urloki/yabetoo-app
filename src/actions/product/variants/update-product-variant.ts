"use server";



import {ProductVariant} from "@/src/shemas/product/product.schema";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

export const updateProductVariant = async (
  accountId: string,
  id: string,
  data: ProductVariant,
) => {
  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/products/variants/${id}`;

  const secret = await getAccountSecret(accountId);

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret.secretValue}`,
    },
    body: JSON.stringify(data),
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
