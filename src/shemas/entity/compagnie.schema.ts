import { z } from "zod";

const company = z.object({
  id: z.string(),
  countryId: z.string(),
  code: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  city: z.object({ id: z.string(), name: z.string() }),
  country: z.object({
    id: z.string(),
    currencyId: z.string(),
    currency: z.object({
      id: z.string(),
      name: z.string(),
      codeIso: z.string(),
    }),
    name: z.string(),
    code: z.string(),
    callSignNumber: z.number(),
    digitNumber: z.number(),
    compensationCurrencyId: z.string(),
    paymentWithMobileMoney: z.boolean(),
  }),
  currencyCode: z.string(),
  compensationCurrencyCode: z.string(),
  reserveAccountId: z.string(),
  creditReserveAccountId: z.string(),
  operationAccountId: z.string(),
  compensationAccountId: z.string(),
  floatingAccountId: z.string(),
  interestAccountId: z.string(),
  nbInstitutions: z.number(),
  nbEmployees: z.number(),
  enabled: z.boolean(),
});

const compagnies = z.object({
  totalCount: z.number(),
  values: z.array(company),
  perPage: z.number(),
  pageCount: z.number(),
});

export type Compagnie = z.infer<typeof compagnies>;
export type Company = z.infer<typeof company>;
