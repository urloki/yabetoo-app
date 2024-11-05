import * as z from "zod";

export const paymentLinkSchema = z
  .object({
    type: z.string(),
    callToAction: z.string(),
    collectAddress: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    currency: z.string().optional(),
    isLimited: z.boolean().optional(),
    showCustomMessage: z.boolean().optional(),
    active: z.boolean().optional(),
    url: z.string().optional(),
    files: z.array(z.instanceof(File)).optional(),
    documents: z
      .array(
        z.object({
          key: z.string(),
          name: z.string(),
          type: z.string(),
          url: z.string(),
          id: z.string(),
        }),
      )
      .optional(),
    limits: z
      .object({
        min: z.string().optional(),
        max: z.string().optional(),
      })
      .optional()
      .nullable(),
    products: z
      .array(
        z.object({
          id: z.string().optional(),
          productName: z.string(),
          price: z.any(),
          quantity: z.any(),
          productId: z.string().optional(),
          documents: z
            .array(
              z.object({
                key: z.string(),
                name: z.string(),
                type: z.string(),
                url: z.string(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
  })
  .superRefine((values, context) => {
    if (values.type === "1" && values.products?.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must add at least one product",
        path: ["products"],
      });
    }

    if (values.type === "2" && values.title == null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required",
        path: ["title"],
      });
    }

    if (values.type === "2" && values.currency == null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Currency is required",
        path: ["currency"],
      });
    }

    if (values.isLimited && values.limits?.min == null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum amount is required",
        path: ["limits", "min"],
      });
    }

    if (values.isLimited && values.limits?.max == null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum amount is required",
        path: ["limits", "max"],
      });
    }
  });
