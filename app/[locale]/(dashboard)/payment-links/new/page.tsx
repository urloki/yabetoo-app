"use client";
import { useRouter } from "next/navigation";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { createPaymentLinkAction } from "@/src/actions/payment-links/create-payment-link.action";
import { paymentLinkSchema } from "@/src/shemas/payments-link/payment-link.schema";
import { jsonToFormData } from "@/lib/json-to-form-data";
import { Form } from "@/components/ui/form";
import TypeSelector from "@/src/features/payments-link/components/type-selector";
import CreateLinkProduct from "@/src/features/payments-link/components/create-link-product";
import CreateLinkChooseWhatToPay from "@/src/features/payments-link/components/choose-what-to-pay";
import OptionSelector from "@/src/features/payments-link/components/option-selector";

function Page() {
  const { currentAccount } = useAccountAtom();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-payment-link"],
    mutationFn: createPaymentLinkAction,
    onSuccess: async () => {
      toast.success("Lien de paiement créé avec succès");
      router.push("/payment-links");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof paymentLinkSchema>>({
    resolver: zodResolver(paymentLinkSchema),
    defaultValues: {
      type: "1",
      products: [],
      callToAction: "1",
      collectAddress: false,
      isLimited: false,
      showCustomMessage: false,
      active: true,
      files: [],
      currency: currentAccount?.country.currency.code,
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentLinkSchema>) => {
    console.log(values);
    const formData = jsonToFormData(values);
    await mutateAsync({
      accountId: currentAccount?.id as string,
      data: formData,
      isLive: currentAccount?.isLive as boolean,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <main className="my-10">
            <div className="mx-auto h-fit w-full items-start overflow-auto md:w-1/2 md:px-5">
              <div className="bg-background border p-5 md:rounded-md">
                <TypeSelector form={form} />
              </div>

              <div className="bg-background mt-5 border p-5 md:rounded-md">
                {form.watch("type") === "1" ? (
                  <CreateLinkProduct form={form} />
                ) : (
                  <CreateLinkChooseWhatToPay form={form} />
                )}
              </div>
              <div className="bg-background mt-5 border p-5 md:rounded-md">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Options
                  </legend>
                  <OptionSelector form={form} />
                </fieldset>
              </div>
              <div className="flex justify-end gap-4 pt-5">
                <Button className="w-fit" type="submit">
                  Créer le lien
                  {isPending && (
                    <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          </main>
        </form>
      </Form>
    </>
  );
}

export default Page;
