"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import {Product} from "@/src/shemas/product/product.schema";
import ProductMediaModule from "@/src/features/products/modules/product-media-module";

function ProductDetails({ form }: { form: UseFormReturn<Product> }) {
  const t = useTranslations("product");

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t("productDetails")}</CardTitle>
        <CardDescription>{t("productDetailsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    <div className="flex items-center justify-between">
                      <p className="w-72">{t("nameHelpText")}</p>
                      <span
                        className={cn(
                          form.watch("name")?.length > 60 && "text-red-500",
                        )}
                      >
                        {form.watch("name")?.length} / 60
                      </span>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea className="resize-y" {...field} />
                  </FormControl>
                  <FormDescription>
                    <div className="flex items-center justify-between">
                      <p className="w-72">{t("descriptionHelpText")}</p>
                      <span
                        className={cn(
                          form.watch("description")?.length > 160 &&
                            "text-red-500",
                        )}
                      >
                        {form.watch("description")?.length} / 160
                      </span>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <ProductMediaModule form={form} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductDetails;
