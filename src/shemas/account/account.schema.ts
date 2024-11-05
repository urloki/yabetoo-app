import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  countryId: z.number(),
  planId: z.number(),
  pkTest: z.string(),
  skTest: z.string(),
  pkLive: z.string(),
  skLive: z.string(),
  isLive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  plan: z.object({
    id: z.number(),
    fee: z.string(),
    fixedFee: z.string(),
    name: z.string(),
    countryId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  country: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    currency: z.object({
      id: z.number(),
      name: z.string(),
      symbol: z.string(),
      code: z.string(),
      countryId: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    phoneOperators: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        countryId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    ),
  }),
  payoutMethod: z
    .object({
      id: z.string(),
      accountId: z.string(),
      type: z.number(),
      phoneNumber: z.string(),
      phoneOperatorId: z.number(),
      countryId: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
      phoneOperator: z.object({
        id: z.number(),
        name: z.string(),
        countryId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      country: z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    })
    .nullable(),
});

export type Account = z.infer<typeof schema>;
