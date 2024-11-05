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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input";
import { Button } from "@/components/ui/button";
import { numberFormat } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { queryClient } from "@/src/providers/react-query-provider";
import {useWithdrawAtom} from "@/src/atoms/withdraw.atom";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {requestWithdraw} from "@/src/actions/withdraw/request-withdraw.action";

const FirstFormSchema = z.object({
  amount: z.string().refine((value) => value !== "", {
    message: "Amount is required",
  }),
});

function WithdrawRequestStep({ balance }: { balance: number }) {
  const { nextStep } = useStepper();
  const t = useTranslations("payment");
  const { setWithdrawId } = useWithdrawAtom();

  const { currentAccount } = useAccountAtom();

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: requestWithdraw,
    onSuccess: async (response) => {
      toast.success("Withdrawal request sent");
      await queryClient.invalidateQueries({
        queryKey: ["account-balance"],
      });
      console.log(response);
      setWithdrawId(response.withdrawId);
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
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-full flex-col space-y-6 px-2">
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
        </div>

        <div className="flex w-full items-center justify-end mt-10">
          <SheetClose asChild>
            <Button variant="underline">{t("cancel")}</Button>
          </SheetClose>
          <Button className="rounded-full" type="submit">
            {t("withdraw")}{" "}
            {isPending && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default WithdrawRequestStep;
