"use client";

import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useFieldArray, Controller, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { PlusCircle } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import { MoneyInput } from "@/components/ui/money-input";
import {Product} from "@/src/shemas/product/product.schema";
import {useAccountAtom} from "@/src/atoms/account.atom";

function VariantModule({ form }: { form: UseFormReturn<Product> }) {
  const {
    fields: optionFields,
    append: appendOption,
    move: moveOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const { fields: variantFields } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const { currentAccount } = useAccountAtom();

  useEffect(() => {
    const firstOptionValues =
      form.watch("options")[0]?.values.filter((value) => value !== "") || [];
    const existingVariants = form.getValues("variants");
    const newVariants = firstOptionValues.map((value) => {
      const existingVariant = existingVariants?.find(
        (variant) => variant.name === value,
      );
      return {
        name: value,
        price: existingVariant ? existingVariant.price : "",
      };
    });
    form.setValue("variants", newVariants);
  }, [form.watch("options")[0]?.values]);

  const onInputOptionValueChange = (
    field: any,
    valueIndex: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const newValues = [...field.value];
    newValues[valueIndex] = e.target.value;
    field.onChange(newValues);
    if (newValues.every((value) => value !== "")) {
      field.onChange([...newValues, ""]);
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onRemoveOptionValue = (field: any, valueIndex: number) => {
    if (field.value.length > 1) {
      const newValues = field.value.filter(
        (_: unknown, i: number) => i !== valueIndex,
      );
      field.onChange(newValues);
    }
  };

  return (
    <Card>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <CardHeader className="w-full flex-col gap-4 space-y-0 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1.5">
            <CardTitle>Variantes</CardTitle>
          </div>
        </CardHeader>
      </div>
      <CardContent>
        <Sortable
          value={optionFields}
          onMove={({ activeIndex, overIndex }) =>
            moveOption(activeIndex, overIndex)
          }
          overlay={<div className="size-full rounded-md bg-primary/10" />}
        >
          <div className="flex w-full flex-col gap-2">
            {optionFields.map((field, index) => (
              <SortableItem key={field.id} value={field.id} asChild>
                <div className="flex w-full gap-4 rounded-lg border p-5">
                  <SortableDragHandle
                    variant="outline"
                    size="icon"
                    className="mt-8 size-8 shrink-0"
                  >
                    <DragHandleDots2Icon
                      className="size-4"
                      aria-hidden="true"
                    />
                  </SortableDragHandle>
                  <div className="flex w-full flex-col gap-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l&apos;option</FormLabel>
                          <FormControl>
                            <Input className="h-8" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.values`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Valeurs de l&apos;option</FormLabel>
                          <FormControl>
                            <Controller
                              control={form.control}
                              name={`options.${index}.values`}
                              render={({ field }) => (
                                <div>
                                  {field.value.map((value, valueIndex) => (
                                    <div
                                      key={valueIndex}
                                      className={`flex items-center gap-2 ${value === "" && valueIndex === field.value.length - 1 ? "pt-2" : "pt-2"}`}
                                    >
                                      <Input
                                        className="h-8"
                                        value={value}
                                        onChange={(e) => {
                                          onInputOptionValueChange(
                                            field,
                                            valueIndex,
                                            e,
                                          );
                                        }}
                                      />
                                      {field.value.length > 1 &&
                                        value !== "" && (
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              onRemoveOptionValue(
                                                field,
                                                valueIndex,
                                              )
                                            }
                                          >
                                            <TrashIcon className="h-4 w-4" />
                                          </Button>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit shrink-0 text-sm"
                      onClick={() => removeOption(index)}
                    >
                      <span className="text-destructive"> Supprimer</span>
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </Sortable>
        {form.watch("options")?.length < 3 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex  items-center justify-start gap-2  text-primary"
            onClick={() => appendOption({ name: "", values: [""] })}
          >
            <PlusCircle className="h-4 w-4" />
            {form.watch("options").length === 0
              ? "Ajouter des options comme la taille ou la couleur"
              : "Ajouter une option"}
          </Button>
        )}
      </CardContent>
      {variantFields.length > 0 && (
        <>
          <Separator className="mb-4" />
          <CardFooter>
            <div className="flex flex-col gap-2">
              {variantFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="h-8" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MoneyInput
                            className="h-8"
                            placeholder="Prix"
                            prefix={
                              currentAccount?.country.currency.code as string
                            }
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name={`variants.${index}.available`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="h-8"
                            placeholder="Disponible"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  /> */}
                </div>
              ))}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default VariantModule;
