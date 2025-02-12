"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { industries_en, industries_fr } from "@/src/config/industries";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UseFormReturn } from "react-hook-form";
import Badge from "@/components/ui/badge/Badge";

export const businessInfoSchema = z
  .object({
    productDescription: z.string(),
    industry: z.string(),
    businessWebsite: z.string().optional(),
    statementDescriptor: z.string().min(5).max(22),
    customerSupportPhoneNumber: z.string(),
    showCustomerSupportPhoneNumber: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.productDescription == null || value.productDescription === "") {
      context.addIssue({
        code: "custom",
        message: "Product description is required",
        path: ["productDescription"],
      });
    }
    if (value.industry == null || value.industry === "") {
      context.addIssue({
        code: "custom",
        message: "Industry is required",
        path: ["industry"],
      });
    }
    if (
      value.customerSupportPhoneNumber == null ||
      value.customerSupportPhoneNumber === ""
    ) {
      context.addIssue({
        code: "custom",
        message: "Customer support phone number is required",
        path: ["customerSupportPhoneNumber"],
      });
    }
  });

function getIndustries(locale: string) {
  switch (locale) {
    case "fr":
      return industries_fr;
    default:
      return industries_en;
  }
}

function getLabelByValue(value: number, locale: string): string | undefined {
  for (const category of getIndustries(locale)) {
    const item = category.items.find((item) => item.value === value);
    if (item) {
      return item.label;
    }
  }
  return undefined; // ou vous pouvez retourner une valeur par défaut si souhaité
}

function BusinessInfo({
  form,
}: {
  form: UseFormReturn<z.infer<typeof businessInfoSchema>>;
}) {
  const t = useTranslations("activateAccount");
  const locale = useLocale();

  return (
    <div className="w-full">
      <p className="pb-10 text-xl font-bold">
        {t("tellUsAboutBusinessDescription")}
      </p>
      <div className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("industry")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? getLabelByValue(Number.parseInt(field.value), locale)
                        : t("industryPlaceholder")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Search..." />
                      <CommandEmpty>No industry found.</CommandEmpty>
                      {getIndustries(locale).map((industry) => (
                        <CommandGroup
                          key={industry.label}
                          heading={industry.label}
                        >
                          {industry.items.map((item) => (
                            <CommandItem
                              key={item.value}
                              onSelect={() => {
                                form.setValue(
                                  "industry",
                                  item.value.toString(),
                                );
                              }}
                              className="text-sm"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.value.toString() === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {item.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                {t("businessWebsite")}{" "}
                <Badge className="ml-2" intent="gray">
                  {t("optional")}
                </Badge>
              </FormLabel>
              <FormControl>
                <Input placeholder="www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <HoverCard>
          <HoverCardTrigger>
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("productDescription")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </HoverCardTrigger>
          <HoverCardContent
            className="ml-20 border-none bg-transparent shadow-none"
            side="right"
          >
            <div>
              <p className="pb-5 text-sm">{t("productDescriptionDetails")}</p>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="py-5">
          <p className="font-bold">{t("publicDetailsTitle")}</p>
          <span className="text-sm text-muted-foreground">
            {t("publicDetailsDescription")}
          </span>
        </div>

        <HoverCard>
          <HoverCardTrigger>
            <FormField
              control={form.control}
              name="statementDescriptor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("statementDescriptor")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </HoverCardTrigger>
          <HoverCardContent
            className="ml-20 border-none bg-transparent shadow-none"
            side="right"
          >
            <div>
              <p className="pb-5 text-sm">{t("statementDescriptorDetails")}</p>
            </div>
          </HoverCardContent>
        </HoverCard>

        <FormField
          control={form.control}
          name="customerSupportPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customerSupportPhoneNumber")}</FormLabel>
              <FormControl>
                <PhoneInput defaultCountry="CG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <HoverCard>
          <HoverCardTrigger>
            <FormField
              control={form.control}
              name="showCustomerSupportPhoneNumber"
              render={({ field }) => (
                <FormItem className="mt-5 flex flex-row items-center justify-between">
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel>
                        {t("showCustomerSupportPhoneNumber")}
                      </FormLabel>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </HoverCardTrigger>
          <HoverCardContent
            className="ml-20 border-none bg-transparent shadow-none"
            side="right"
          >
            <div>
              <p className="pb-5 text-sm">
                {t("showCustomerPhoneNumberDetails")}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

export default BusinessInfo;
