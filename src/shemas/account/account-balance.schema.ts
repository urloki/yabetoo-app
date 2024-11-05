import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  accountId: z.string(),
  balance: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  transactions: z.array(
    z.object({
      id: z.string(),
      object: z.string(),
      walletId: z.string(),
      chargeId: z.string(),
      intentId: z.string(),
      amount: z.number(),
      amountCaptured: z.number(),
      amountFee: z.number(),
      currency: z.string(),
      oldBalance: z.number(),
      time: z.string(),
      date: z.string(),
      newBalance: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
  withdraws: z.array(
    z.object({
      id: z.string(),
      object: z.string(),
      walletId: z.string(),
      financialTransactionId: z.string().optional(),
      transactionId: z.string().optional(),
      amount: z.number(),
      currency: z.string(),
      status: z.string(),
      failureCode: z.string().optional(),
      failureMessage: z.string().optional(),
      externalId: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

const walletTransactionSchema = z.object({
  id: z.string(),
  object: z.string(),
  walletId: z.string(),
  chargeId: z.string(),
  intentId: z.string(),
  amount: z.number(),
  amountCaptured: z.number(),
  amountFee: z.number(),
  currency: z.string(),
  oldBalance: z.number(),
  time: z.string(),
  date: z.string(),
  newBalance: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const withdrawSchema = z.object({
  id: z.string(),
  object: z.string(),
  walletId: z.string(),
  financialTransactionId: z.string().optional(),
  transactionId: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  failureCode: z.string().optional(),
  failureMessage: z.string().optional(),
  externalId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  executedAt: z.string().optional(),
  shouldExecutedAt: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export type Withdraw = z.infer<typeof withdrawSchema>;

export type WalletTransaction = z.infer<typeof walletTransactionSchema>;

export type AccountBalance = z.infer<typeof schema>;
