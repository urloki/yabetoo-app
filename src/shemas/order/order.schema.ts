import { z } from "zod";

export const orderSchema = z.object({
  id: z.string(),
  object: z.string(),
  accountId: z.string(),
  total: z.string(),
  currency: z.string(),
  status: z.string(),
  intentId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      orderId: z.string(),
      productId: z.string(),
      quantity: z.number(),
      price: z.string(),
      productName: z.string(),
      object: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});
