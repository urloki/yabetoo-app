"use client";
import { z } from "zod";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { queryClient } from "@/src/providers/react-query-provider";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { useWithdrawAtom } from "@/src/atoms/withdraw.atom";
import { confirmWithdraw } from "@/src/actions/withdraw/confirm-withdraw.action";
import { cancelWithdraw } from "@/src/actions/withdraw/cancel-withdraw.action";
import { resendWithdrawOtp } from "@/src/actions/withdraw/resend-withdraw-otp.action";
import { Stepper } from "@stepperize/react";

export const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function WithdrawOTPStep({ id, stepper }: { id?: string; stepper: Stepper }) {
  //const { nextStep } = useStepper();
  const { currentAccount } = useAccountAtom();
  const { withdrawId } = useWithdrawAtom();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: confirmWithdraw,
    onSuccess: async () => {
      toast.success("Withdrawal request sent");
      await queryClient.invalidateQueries({
        queryKey: ["account-balance"],
      });
      stepper.next();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error.message);
    },
  });

  const { mutate: mutateCancelWithdraw, isPending: isPendindCancelWithdraw } =
    useMutation({
      mutationFn: cancelWithdraw,
      onSuccess: async () => {
        toast.success("Votre retrait a été annulé");
        await queryClient.invalidateQueries({
          queryKey: ["account-balance"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error.message);
      },
    });

  const { mutate: mutateOtp, isPending: isPendingOtp } = useMutation({
    mutationFn: resendWithdrawOtp,
    onSuccess: (response) => {
      toast.success("Un code de retrait a été envoyé");
      console.log(response);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error.message);
    },
  });

  function onSubmit(data: z.infer<typeof otpSchema>) {
    mutate({
      accountId: currentAccount?.id as string,
      isLive: currentAccount?.isLive as boolean,
      otp: data.pin,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 px-2 pb-2"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code de retrait</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-center gap-4 pt-10">
          <Button
            type="button"
            variant="underline"
            onClick={() =>
              mutateOtp({
                accountId: currentAccount?.id as string,
                isLive: currentAccount?.isLive as boolean,
              })
            }
          >
            Renvoyer le code
            {isPendingOtp && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              mutateCancelWithdraw({
                accountId: currentAccount?.id as string,
                isLive: currentAccount?.isLive as boolean,
                id: id ?? withdrawId,
              })
            }
          >
            Annuler
            {isPendindCancelWithdraw && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
          <Button type="submit">
            Confirmer
            {isPending && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default WithdrawOTPStep;
