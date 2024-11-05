import { z } from "zod";

export const customerSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  accountId: z.string(),
  paymentMethodId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  paymentMethod: z.object({
    id: z.string(),
    type: z.string(),
    msisdn: z.string(),
    country: z.string(),
    operator: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
