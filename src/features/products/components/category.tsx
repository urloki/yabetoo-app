"use client";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import {Product} from "@/src/shemas/product/product.schema";
import {getProductCategory} from "@/src/config/products";

function Category({ form }: { form: UseFormReturn<Product> }) {
  const t = useTranslations("product");
  const locale = useLocale();
  return (
    <div className="grid gap-6 pt-5 sm:grid-cols-3">
      <div className="grid gap-3">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem defaultValue={form.watch("category")} className="w-72">
              <FormLabel>{t("category")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("categoryPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  defaultValue={form.watch("category")}
                  className="w-72"
                >
                  {getProductCategory(locale).map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default Category;
