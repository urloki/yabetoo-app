"use client";
import {useMutation, useQuery} from "@tanstack/react-query";
import Loader from "@/components/loader";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import type * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getPaymentLinkByIdAction} from "@/src/actions/payment-links/get-payment-link-by-id.action";
import {updatePaymentLinkAction} from "@/src/actions/payment-links/update-payment-link.action";
import {paymentLinkSchema} from "@/src/shemas/payments-link/payment-link.schema";
import TypeSelector from "@/src/features/payments-link/components/type-selector";
import CreateLinkProduct from "@/src/features/payments-link/components/create-link-product";
import CreateLinkChooseWhatToPay from "@/src/features/payments-link/components/choose-what-to-pay";
import OptionSelector from "@/src/features/payments-link/components/option-selector";
import {jsonToFormData} from "@/lib/json-to-form-data";
import {Form} from "@/components/ui/form";

function Page({params}: { params: { id: string } }) {
    const {currentAccount} = useAccountAtom();
    const {data, isLoading} = useQuery({
        queryKey: [
            "show-payment-link",
            params.id,
            currentAccount?.id,
            currentAccount?.isLive,
        ],
        queryFn: ({queryKey}) =>
            getPaymentLinkByIdAction(
                queryKey[2] as string,
                queryKey[1] as string,
                queryKey[3] as boolean,
            ),
    });

    const router = useRouter();
    const {mutateAsync, isPending} = useMutation({
        mutationKey: ["update-payment-link"],
        mutationFn: updatePaymentLinkAction,
        onSuccess: async () => {
            toast.success("Modification du lien de paiement effectuée");
            router.push("/payment-links");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    console.log("data", data);

    const form = useForm<z.infer<typeof paymentLinkSchema>>({
        resolver: zodResolver(paymentLinkSchema),
        values: {
            type: data?.type.toString() ?? "1",
            products: data?.products ?? [],
            title: data?.title ?? "",
            description: data?.description ?? "",
            callToAction: data?.callToAction.toString() ?? "1",
            currency: data?.currency ?? "xaf",
            collectAddress: data?.collectAddress ?? false,
            isLimited: data?.isLimited ?? false,
            showCustomMessage: data?.showCustomMessage ?? false,
            active: data?.active ?? true,
            limits: data?.limits,
            documents: data?.documents,
        },
    });

    const onSubmit = async (values: z.infer<typeof paymentLinkSchema>) => {
        console.log(values);
        const formData = jsonToFormData(values);
        await mutateAsync({
            accountId: currentAccount?.id as string,
            linkId: params.id,
            data: formData,
            isLive: currentAccount?.isLive as boolean,
        });
    };
    return (
        <Loader isLoading={isLoading}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <main className="my-10">
                        <div className="mx-auto h-fit w-full items-start overflow-auto md:w-1/2 md:px-5">
                            <div className="border bg-background p-5 md:rounded-md">
                                <TypeSelector form={form}/>
                            </div>
                            <div className="mt-5 border bg-background p-5  md:rounded-md">
                                {form.watch("type") === "1" ? (
                                    <CreateLinkProduct form={form}/>
                                ) : (
                                    <CreateLinkChooseWhatToPay form={form}/>
                                )}
                            </div>
                            <div className="mt-5 border bg-background p-5  md:rounded-md">
                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Options
                                    </legend>
                                    <OptionSelector form={form}/>
                                </fieldset>
                            </div>
                            <div className="flex justify-end gap-4 pt-5">
                                <Button className="w-fit" type="submit">
                                    Modifier
                                    {isPending && (
                                        <Icons.spinner className="ml-2 h-4 w-4 animate-spin"/>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </main>
                </form>
            </Form>
        </Loader>
    );
}

export default Page;
