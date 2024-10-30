import { z } from "zod"

export const pictureSchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string().nullable(),
  path: z.string().nullable(),
  type: z.string().nullable()
})

export const userInterfaceSchema = z.object({
  id: z.number(),
  number: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string(),
  email: z.string(),
  emailConfirmed: z.boolean(),
  phoneNumber: z.string(),
  accountConfirmed: z.boolean(),
  countryId: z.string(),
  profile: z.number(),
  profileId: z.string(),
  picture: pictureSchema,
  fullName: z.string(),
  employeeId: z.string().nullable(),
  companyId: z.string(),
  dealerId: z.string().nullable(),
  businessDevManagerId: z.string().nullable(),
  institutionId: z.string(),
  enterpriseId: z.string().nullable(),
  merchantId: z.string().nullable(),
  agencyId: z.string(),
  ticketOfficeId: z.string().nullable(),
  workingForEntity: z.string(),
  attachedToYabetoo: z.boolean().nullable(),
  showSpecificConfig: z.boolean(),
  roles: z.array(z.string())
})

export type UserType = z.infer<typeof userInterfaceSchema>