import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  active: z.boolean(),
  allowPromotionCodes: z.boolean(),
  orderId: z.string().optional(),
  accountId: z.string(),
  isLive: z.boolean(),
  collectAddress: z.boolean(),
  isLimited: z.boolean(),
  limits: z
    .object({
      min: z.string().optional(),
      max: z.string().optional(),
    })
    .optional(),
  customerId: z.string(),
  callbackUrl: z.string(),
  intentId: z.null(),
  amount: z.null(),
  currency: z.null(),
  description: z.null(),
  paymentMethodTypes: z.null(),
  title: z.null(),
  showCustomMessage: z.boolean(),
  customMessage: z.null(),
  type: z.number(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        key: z.string(),
        type: z.string(),
        url: z.string(),
        id: z.string(),
      }),
    )
    .optional(),
  callToAction: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  url: z.string(),
  allProducts: z
    .array(
      z.union([
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.string(),
          category: z.string(),
          status: z.string(),
          object: z.string(),
          accountId: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
          variants: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              price: z.string(),
              productId: z.string(),
              object: z.string(),
              category: z.number(),
              active: z.boolean(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
          ),
        }),
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.string(),
          category: z.string(),
          status: z.string(),
          object: z.string(),
          accountId: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
          variants: z.array(z.unknown()),
        }),
      ]),
    )
    .optional(),
  intents: z
    .array(
      z.object({
        id: z.string(),
        object: z.string(),
        label: z.string(),
        amount: z.number(),
        receivedAmount: z.null(),
        currency: z.string(),
        clientSecret: z.string(),
        paymentMethod: z.null(),
        paymentMethodTypes: z.null(),
        status: z.string(),
        description: z.null(),
        receiptEmail: z.null(),
        payoutId: z.null(),
        payoutStatus: z.string(),
        chargeId: z.string(),
        metadata: z.object({ link_id: z.string() }),
        createdAt: z.string(),
        updatedAt: z.string(),
        payouts: z.array(z.unknown()),
        charges: z.array(
          z.object({
            id: z.string(),
            object: z.string(),
            intentId: z.string(),
            financialTransactionId: z.string(),
            transactionId: z.string(),
            amount: z.number(),
            captured: z.boolean(),
            refunded: z.boolean(),
            disputed: z.boolean(),
            currency: z.string(),
            status: z.string(),
            failureCode: z.null(),
            failureMessage: z.null(),
            externalId: z.string(),
            paymentMethodId: z.string(),
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
              customer: z.object({
                id: z.string(),
                firstName: z.string(),
                lastName: z.string(),
                email: z.string(),
                phone: z.string(),
                accountId: z.string(),
                paymentMethodId: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
              }),
            }),
          }),
        ),
      }),
    )
    .optional(),
  products: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string(),
        linkId: z.string(),
        price: z.string(),
        quantity: z.string(),
        productName: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    )
    .optional(),
});

export const productSchema = z.object({
  id: z.string(),
  productId: z.string(),
  linkId: z.string(),
  price: z.string(),
  quantity: z.any(),
  productName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type PaymentLink = z.infer<typeof schema>;
