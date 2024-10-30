import { z } from "zod";

export const createMerchantSchema = z.object({
  phone: z.string(),
  createdFromType: z.string(),
  roles: z.array(z.unknown()),
  documents: z.array(z.unknown()),
  role: z.string(),
  countryId: z.string(),
  name: z.string(),
  legalForm: z.string(),
  activitySector: z.string(),
  managerName: z.string(),
  managerFirstName: z.string(),
  address: z.string(),
  cityId: z.string(),
  managerEmail: z.string(),
  companyId: z.string(),
  signInSponsorCode: z.string().nullable(),
  enable: z.boolean(),
});

export type CreateMerchant = z.infer<typeof createMerchantSchema>;
