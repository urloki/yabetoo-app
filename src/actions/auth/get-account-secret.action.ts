"use server";

import axios from "axios";

interface IAccountSecret {
  secretValue: string;
}

export const getAccountSecret = async (
  accountId: string,
): Promise<IAccountSecret> => {
  const host = process.env.ACCOUNT_API;

  if (!host) {
    throw new Error("AUTH API URL not found");
  }

  const url = `${host}/v1/admin/account/${accountId}/secret`;

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${process.env.SECRET}`,
      },
    })
    .then((res) => res.data).catch((err) => {
      console.log(err);
      throw new Error("Error getting account secret");
    });
};
