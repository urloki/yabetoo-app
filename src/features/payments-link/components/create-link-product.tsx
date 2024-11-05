"use client";
import React, { useEffect, useRef } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { ShoppingBag } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Cross1Icon } from "@radix-ui/react-icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { numberFormat } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import placeholder from "@/public/placeholder.svg";
import Image from "next/image";
import type { z } from "zod";
import { useTranslations } from "next-intl";
import {paymentLinkSchema} from "@/src/shemas/payments-link/payment-link.schema";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getProducts} from "@/src/actions/product/get-products";

function CreateLinkProduct({
  form,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
}) {
  const [open, setOpen] = React.useState(false);
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("paymentLink");

  const ref = useRef<HTMLDivElement>(null);

  const { data: products } = useQuery({
    queryKey: ["products", currentAccount?.id],
    queryFn: ({ queryKey }) => getProducts(queryKey[1] as string),
  });

  console.log(products);

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        console.log("Outside Clicked. ", open);
        if (open) setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("mousedown", handleOutSideClick);
    }

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [open]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const appendProduct = form.getValues("products");

  const filteredProducts = products?.filter((product) => {
    return !appendProduct?.some((item) => item.productId === product.id);
  });

  return (
    <div className="mt-5">
      <fieldset className="gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          {t("productsOrSubscriptions")}
        </legend>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative my-5 flex flex-col rounded-md border p-5"
          >
            <div className="flex">
              <div className="flex h-20 w-24 items-center justify-center rounded border bg-gray-100">
                <Image
                  src={placeholder}
                  alt={"product"}
                  className={"rounded"}
                />
              </div>

              <div className="h-10 pl-2">
                <FormField
                  control={form.control}
                  name={`products.${index}.productName` as const}
                  render={({ field }) => (
                    <FormItem className={"w-full p-0"}>
                      <span className="font-bold">{field.value}</span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`products.${index}.price` as const}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="pb-2">
                        {numberFormat(
                          field.value,
                          currentAccount?.country?.currency?.code,
                        )}
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`products.${index}.quantity` as const}
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center">
                      <FormControl>
                        <Input
                          min={1}
                          type={"number"}
                          className="h-8 w-14"
                          defaultValue={field.value}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="pb-2 pl-2">Quantity</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                remove(index);
              }}
              size={"icon"}
              variant={"destructive"}
              className="absolute -right-3 -top-2"
            >
              <Cross1Icon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Command className="mt-5 rounded-md border shadow-none">
          <CommandInput
            onClick={() => {
              setOpen(true);
            }}
            placeholder="Find procduct..."
          />
          {open && (
            <CommandList ref={ref}>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredProducts?.map((product) => (
                  <CommandItem
                    key={product.id}
                    className="cursor-pointer"
                    onSelect={() => {
                      setOpen(false);
                      append({
                        productName: product.name,
                        price: product.price,
                        quantity: 1,
                        productId: product.id,
                        id: product.id,
                        documents: product.documents ?? [],
                      });
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>{product.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </fieldset>
    </div>
  );
}

export default CreateLinkProduct;
