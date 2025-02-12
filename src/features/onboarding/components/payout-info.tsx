"use client";
import { z } from "zod";
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
import { PhoneInput } from "@/components/phone-input";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { useOnboardingAtom } from "@/src/atoms/onboarding.atom";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { CountryCode } from "libphonenumber-js";

export const payoutInfoSchema = z
  .object({
    operatorId: z.string(),
    payoutPhoneNumber: z.string().min(1),
  })
  .superRefine((value, context) => {
    if (value.operatorId == null || value.operatorId === "") {
      context.addIssue({
        code: "custom",
        message: "Operator is required",
        path: ["operatorId"],
      });
    }
    if (value.payoutPhoneNumber == null || value.payoutPhoneNumber === "") {
      context.addIssue({
        code: "custom",
        message: "Payout phone number is required",
        path: ["payoutPhoneNumber"],
      });
    }
  });

function PayoutInfo({
  form,
}: {
  form: UseFormReturn<z.infer<typeof payoutInfoSchema>>;
}) {
  const { personalData } = useOnboardingAtom();

  const t = useTranslations("activateAccount");

  const { currentAccount } = useAccountAtom();
  return (
    <div className="w-full">
      <p className="pb-10 text-xl font-bold">{t("payoutMethodDescription")}</p>
      <div className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="operatorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("operator")}</FormLabel>
              <Select
                defaultValue={personalData.operatorId}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("operatorPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {currentAccount?.country.phoneOperators.map((operator) => (
                    <SelectItem
                      key={operator.id}
                      value={operator.id.toString()}
                    >
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payoutPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry={
                    (currentAccount?.country.code.toUpperCase() as CountryCode) ??
                    "FR"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default PayoutInfo;
