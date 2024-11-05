import { z } from "zod";

const city = z.object({
  totalCount: z.number(),
  values: z.array(
    z.object({
      id: z.string(),
      countryId: z.string(),
      countryName: z.string(),
      name: z.string(),
      enabled: z.boolean(),
    }),
  ),
  perPage: z.number(),
  pageCount: z.number(),
});

export type Cities = z.infer<typeof city>;
