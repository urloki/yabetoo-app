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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Package, Wallet2 } from "lucide-react";
import type { z } from "zod";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {paymentLinkSchema} from "@/src/shemas/payments-link/payment-link.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const linkTypesEn = [
  {
    label: "Products or subscriptions",
    value: "1",
    description: "Best for selling ecommerce or software-as-a-service",
    icon: <Package className="h-7 w-7" />,
  },
  {
    label: "Customer choose what to pays",
    value: "2",
    description: "Best for tipping, donation or pay what you want",
    icon: <Wallet2 className="h-7 w-7" />,
  },
] as const;

const linkTypesFr = [
  {
    label: "Produits ou abonnements",
    value: "1",
    description: "Meilleur pour les produits ou les abonnements",
    icon: <Package className="h-7 w-7" />,
  },
  {
    label: "Client choisit ce qu'il doit payer",
    value: "2",
    description:
      "Meilleur pour les dons, les tips ou les paiements personnalisés",
    icon: <Wallet2 className="h-7 w-7" />,
  },
] as const;

const getLinkTypes = (locale: string) => {
  switch (locale) {
    case "fr":
      return linkTypesFr;
    default:
      return linkTypesEn;
  }
};

function TypeSelector({
  form,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("paymentLink");
  const locale = useLocale();

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-xl font-bold">{t("selectType")}</FormLabel>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-fit min-w-[300px] justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? getLinkTypes(locale).find(
                        (language) => language.value === field.value,
                      )?.label
                    : "Select type"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-5 mt-1 w-full p-0">
                <DropdownMenuGroup>
                  {getLinkTypes(locale ?? "fr")?.map((language) => (
                    <DropdownMenuItem
                      key={language.value}
                      onSelect={() => {
                        form.setValue("type", language.value);
                        setOpen(false);
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        {language.icon}
                        <div className="flex flex-col gap-1">
                          <span>{language.label}</span>
                          <span className="w-64 text-muted-foreground">
                            {language.description}
                          </span>
                        </div>
                      </div>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          language.value === field.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

            </DropdownMenuContent>
          </DropdownMenu>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default TypeSelector;
