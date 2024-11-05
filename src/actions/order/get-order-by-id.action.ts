"use server";


import axios from "axios";

export const getOrderByIdAction = async (token: string, id: string) => {
  const host = process.env.PRODUCT_API;

  const url = `${host}/v1/orders/${id}`;

  if (!host) {
    throw new Error("PRODUCT API URL not found");
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error getting order");
    });
};
