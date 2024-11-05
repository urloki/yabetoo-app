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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input";
import { useTranslations } from "next-intl";
import {Product} from "@/src/shemas/product/product.schema";
import {useAccountAtom} from "@/src/atoms/account.atom";

function Price({ form }: { form: UseFormReturn<Product> }) {
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("product");

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t("pricing")}</CardTitle>
        <CardDescription>{t("priceDetails")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("price")}</FormLabel>
                  <FormControl>
                    <MoneyInput
                      prefix={currentAccount?.country.currency.code as string}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Price;
