import { z } from "zod";

export const pictureSchema = z.object({
  id: z.string(),
  managerId: z.string().nullable(),
  date: z.string(),
  name: z.string().nullable(),
  path: z.string().nullable(),
  type: z.string().nullable(),
  documentType: z.number(),
  originDocumentType: z.string().nullable()
})

export const currencySchema = z.object({
  id: z.string(),
  name: z.string(),
  codeIso: z.string()
})

export const citySchema = z.object({
  id: z.string(),
  name: z.string()
})

export const countrySchema = z.object({
  id: z.string(),
  currencyId: z.string(),
  currency: currencySchema,
  name: z.string(),
  code: z.string(),
  callSignNumber: z.number(),
  digitNumber: z.number(),
  compensationCurrencyId: z.string(),
  paymentWithMobileMoney: z.boolean()
})

export const institutionSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  company: z.any().nullable(),
  reserveAccountId: z.string(),
  operationAccountId: z.string(),
  countryId: z.string(),
  country: countrySchema.nullable(),
  cityId: z.string().nullable(),
  city: citySchema.nullable(),
  name: z.string(),
  attachedToYabetoo: z.boolean().nullable()
})

export const agencySchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  bankTreasuryId: z.string().nullable(),
  institution: institutionSchema,
  countryId: z.string(),
  country: countrySchema,
  cityId: z.string(),
  city: citySchema.nullable(),
  name: z.string()
})

export const merchantInterfaceSchema = z.object({
  id: z.string(),
  picture: pictureSchema,
  companyId: z.string().nullable(),
  signInSponsorCode: z.string().nullable(),
  agencyId: z.string(),
  agency: agencySchema,
  countryId: z.string(),
  country: countrySchema,
  cityId: z.string(),
  city: citySchema,
  currencyCode: z.string(),
  createdFromType: z.number(),
  businessCode: z.string(),
  businessSize: z.number(),
  modeReceiptPayment: z.number(),
  partnerCashBack: z.boolean(),
  name: z.string(),
  fullIdentity: z.string(),
  legalForm: z.string(),
  capital: z.number().nullable(),
  activitySector: z.string(),
  managerName: z.string(),
  managerFirstName: z.string(),
  managerEmail: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  fullAddress: z.string(),
  address: z.string(),
  status: z.number(),
  role: z.string(),
  tva: z.number().nullable(),
  enabled: z.boolean(),
  sponsorId: z.string(),
  sponsorCode: z.string(),
  walletAccountId: z.string(),
  walletAccountNumber: z.string(),
  creditCardId: z.string(),
  savingAccountId: z.string(),
  savingAccountNumber: z.string(),
  savingBlockedAccountId: z.string(),
  savingBlockedAccountNumber: z.string(),
  bankName: z.string().nullable(),
  bankIban: z.string().nullable(),
  bankCode: z.string().nullable(),
  bankAccount: z.string().nullable(),
  bankBic: z.string().nullable(),
  bankSwift: z.string().nullable(),
  nbDocuments: z.number(),
  nbEmployees: z.number()
})


export type Merchant = z.infer<typeof merchantInterfaceSchema>
