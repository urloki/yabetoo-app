"use client";

import { z } from "zod";
import { useStepper } from "@/components/ui/stepper";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { queryClient } from "@/src/providers/react-query-provider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countryData from "@/src/config/country-data";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {findCountry, getOperator} from "@/lib/utils";
import {PhoneInput} from "@/components/ui/phone-input";
import {requestTransfer} from "@/src/actions/transfer/request-transfer.action";

const FirstFormSchema = z.object({
  amount: z.string().refine((value) => value !== "", {
    message: "Amount is required",
  }),
  firstName: z.string().refine((value) => value !== "", {
    message: "First name is required",
  }),
  lastName: z.string().refine((value) => value !== "", {
    message: "Last name is required",
  }),
  country: z.string().refine((value) => value !== "", {
    message: "Country is required",
  }),
  operator: z.string().refine((value) => value !== "", {
    message: "Operator is required",
  }),
  phoneNumber: z.string().refine((value) => value !== "", {
    message: "Phone number is required",
  }),
});

function TransferRequestStep({ balance }: { balance: number }) {
  const { nextStep } = useStepper();
  const t = useTranslations("payment");

  const { currentAccount } = useAccountAtom();

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: requestTransfer,
    onSuccess: async (response) => {
      toast.success("Withdrawal request sent");
      await queryClient.invalidateQueries({
        queryKey: ["account-balance"],
      });
      console.log(response);
      nextStep();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error.message);
    },
  });

  function onSubmit(data: z.infer<typeof FirstFormSchema>) {
    console.log(data);
    mutate({
      accountId: currentAccount?.id as string,
      isLive: currentAccount?.isLive as boolean,
      amount: data.amount,
      country: data.country,
      operator: data.operator,
      phoneNumber: data.phoneNumber.replace(/\s/g, ""),
      firstName: data.firstName,
      lastName: data.lastName,
      type: "1",
      currency: findCountry(data.country)?.currency as string,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-full flex-col gap-6 px-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant</FormLabel>
                <FormControl>
                  <MoneyInput
                    prefix={currentAccount?.country.currency.symbol as string}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryData.country.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {form.watch("country") && form.watch("country") === "fr" && (
                    <FormDescription>
                      <p className="text-xs text-danger-500">
                        Les transferts vers les pays de l&apos;UE ne sont pas
                        encore pris en charge.
                      </p>
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opérateur</FormLabel>
                  <Select
                    disabled={
                      form.watch("country") == null ||
                      form.watch("country") === "fr"
                    }
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getOperator(form.watch("country")).map((operator) => (
                        <SelectItem key={operator.value} value={operator.value}>
                          {operator.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {!currentAccount?.isLive &&
                    form.watch("operator") === "airtel" && (
                      <FormDescription>
                        <p className="text-xs text-danger-500">
                          Les transferts vers {form.watch("operator")} ne sont
                          pas pris en charge en mode test.
                        </p>
                      </FormDescription>
                    )}
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° de téléphone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      disabled={
                        form.watch("country") == null ||
                        form.watch("operator") == null ||
                        form.watch("country") === "fr"
                      }
                      format={findCountry(form.watch("country"))?.format ?? ""}
                      mask=" "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-end mt-10">
          <SheetClose asChild>
            <Button variant="underline">{t("cancel")}</Button>
          </SheetClose>
          <Button className="rounded-full" disabled={isPending || balance <= 0} type="submit">
            {t("transfer")}
            {isPending && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TransferRequestStep;
