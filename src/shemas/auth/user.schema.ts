import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  role: z.string(),
  resetCode: z.string().nullable(),
  resetCodeExpiresAt: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  emailVerified: z.boolean(),
  emailVerificationToken: z.any(),
  emailVerificationTokenExpiresAt: z.any(),
  avatarUrl: z.string().nullable(),
  isLocked: z.boolean(),
  lockedUntil: z.any(),
});

export type UserType = z.infer<typeof schema>;
