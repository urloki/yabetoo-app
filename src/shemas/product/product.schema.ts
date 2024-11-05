import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(3).max(70),
    description: z.string().min(10),
    status: z.string(),
    options: z.array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
      }),
    ),
    variants: z
      .array(
        z.object({
          name: z.string(),
          price: z.string(),
        }),
      )
      .optional(),
    category: z.coerce.string(),
    price: z.string(),
    accountId: z.string().optional(),
    id: z.string().optional(),
    files: z.array(z.instanceof(File)).optional(),
    documents: z
      .array(
        z.object({
          name: z.string(),
          key: z.string(),
          type: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
  })
  .superRefine((value, context) => {
    if (value.category === "") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vous devez choisir une catégorie",
        path: ["category"],
      });
    }

    if (value.category === "undefined") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vous devez choisir une catégorie",
        path: ["category"],
      });
    }

    if (value.variants && value.variants.length > 0) {
      value.variants.forEach((variant, index) => {
        if (!variant.name || variant.name.trim() === "") {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Le nom de la variante est obligatoire",
            path: [`variants.${index}.name`],
          });
        }
        if (!variant.price || variant.price.trim() === "") {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Le prix de la variante est obligatoire",
            path: ["variants", index, "price"],
          });
        }
      });
    }
  });

export const variantSchema = z.object({
  name: z
    .string({
      required_error: "Variant name is required.",
    })
    .min(3, { message: "Variant name must be 3 or more characters long." })
    .max(70, { message: "Variant name must be 70 or less characters long." }),
  description: z
    .string({
      required_error: "Variant description is required.",
    })
    .min(10, {
      message: "Variant description must be 10 or more characters long.",
    }),
  productId: z.string(),
  price: z.string(),
  category: z.coerce.string(),
  active: z.boolean().optional(),
});

export type ProductVariant = z.infer<typeof variantSchema>;

export type Product = z.infer<typeof productSchema>;
