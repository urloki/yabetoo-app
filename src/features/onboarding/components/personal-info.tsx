"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

//import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslations } from "next-intl";

import InputDate from "@/components/ui/date-input";
import { PhoneInput } from "@/components/phone-input";

export const personalInfoSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    dateOfBirth: z.any(),
    phoneNumber: z.string(),
    address: z.string(),
  })
  .superRefine((value, context) => {
    if (value.dateOfBirth == null || value.dateOfBirth === "") {
      context.addIssue({
        code: "custom",
        message: "Date of birth is required",
        path: ["dateOfBirth"],
      });
    }
  });

function PersonalInfo({
  form,
}: {
  form: UseFormReturn<z.infer<typeof personalInfoSchema>>;
}) {
  const t = useTranslations("activateAccount");

  return (
    <div className="flex w-full flex-col gap-5">
      <p className="pb-5 text-xl font-bold">
        {t("personalDetailsDescription")}
      </p>

      <div className="flex w-full flex-col gap-10 px-2 py-5">
        <div>
          <FormLabel>{t("legalName")}</FormLabel>
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("firstName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Input placeholder={t("lastName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("email")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dateOfBirth")}</FormLabel>
              <FormControl>
                <InputDate {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("address")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phoneNumber")}</FormLabel>
              <FormControl>
                <PhoneInput defaultCountry="CG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default PersonalInfo;
