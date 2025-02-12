"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useAccountAtom } from "@/src/atoms/account.atom";

export const businessTypeSchema = z
  .object({
    typeOfBusiness: z.string(),
    countryId: z.string(),
    businessStructure: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (
      (values.typeOfBusiness === "2" || values.typeOfBusiness === "3") &&
      values.businessStructure == null
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Business structure is required",
        path: ["businessStructure"],
      });
    }
  });

function BusinessType({
  form,
}: {
  form: UseFormReturn<z.infer<typeof businessTypeSchema>>;
}) {
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("activateAccount");

  return (
    <HoverCard>
      <div className="space-y-6 md:w-2/3">
        <div className="w-full md:pr-2">
          <p className="pb-10 text-xl font-bold">
            {t("businessTypeDescription")}
          </p>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("businessLocation")}</FormLabel>
                  <Select
                    defaultValue={currentAccount?.countryId.toString()}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("businessLocationPlaceholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={currentAccount?.countryId.toString() ?? "1"}
                      >
                        {currentAccount?.country.name}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <HoverCardTrigger>
              <FormField
                control={form.control}
                name="typeOfBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("typeOfBusiness")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("typeOfBusinessPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="md:w-full" defaultValue="1">
                        <SelectItem value="1">Auto-entrepreneur</SelectItem>
                        <SelectItem value="2">Société</SelectItem>
                        <SelectItem value="3">Association</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </HoverCardTrigger>
            {form.watch("typeOfBusiness") === "2" && (
              <FormField
                control={form.control}
                name="businessStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("businessStructure")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("businessStructurePlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue="1">
                        <SelectItem value="1">Société en commandite</SelectItem>
                        <SelectItem value="2">
                          Société en nom collectif
                        </SelectItem>
                        <SelectItem value="3">Societe non cotée</SelectItem>
                        <SelectItem value="4">
                          Other/i&apos;m note sure{" "}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("typeOfBusiness") === "3" && (
              <FormField
                control={form.control}
                name="businessStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("businessStructure")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("businessStructurePlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue="1">
                        <SelectItem value="1">Association déclarée</SelectItem>
                        <SelectItem value="2">Association de fait</SelectItem>
                        <SelectItem value="3">
                          Other/i&apos;m note sure
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </div>

      <HoverCardContent
        className="ml-20 mt-40 hidden border-none bg-transparent shadow-none md:block"
        side="right"
      >
        <div>
          <h1 className="font-bold">{t("individualEntrepreneurTitle")}</h1>
          <p className="pb-5 text-sm">
            {t("individualEntrepreneurDescription")}
          </p>
          <h1 className="font-bold">{t("companyTitle")}</h1>
          <p className="pb-5 text-sm">{t("companyDescription")}</p>
          <h1 className="font-bold">{t("associationDescription")}</h1>
          <p className="pb-5 text-sm">{t("associationDescription")}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default BusinessType;
