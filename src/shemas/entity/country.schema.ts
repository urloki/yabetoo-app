import { z } from "zod";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  phoneOperators: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      countryId: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
  currency: z.object({
    id: z.number(),
    name: z.string(),
    symbol: z.string(),
    code: z.string(),
    countryId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type Country = z.infer<typeof schema>;
