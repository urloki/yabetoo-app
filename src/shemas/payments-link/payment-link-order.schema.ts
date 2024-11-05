import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  object: z.string(),
  accountId: z.string(),
  total: z.string(),
  currency: z.string(),
  isPaid: z.string(),
  intentId: z.string(),
  paymentLinkId: z.string(),
  isLive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      paymentLinkOrderId: z.string(),
      productId: z.string(),
      quantity: z.number(),
      price: z.string(),
      productName: z.string(),
      object: z.string(),
      options: z.any(),
      variant: z.any(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

export type PaymentLinkOrder = z.infer<typeof schema>;
