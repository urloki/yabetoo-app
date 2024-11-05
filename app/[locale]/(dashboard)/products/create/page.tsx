"use client";
import {Button} from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Icons} from "@/components/icons";
import {useTranslations} from "next-intl";
import ProductDetails from "@/src/features/products/components/product-details";
import Price from "@/src/features/products/components/price";
import {cleanOptionsValues} from "@/lib/utils";
import {useMutation} from "@tanstack/react-query";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {createProduct} from "@/src/actions/product/create-product";
import {Product, productSchema} from "@/src/shemas/product/product.schema";
import {jsonToFormData} from "@/lib/json-to-form-data";
import VariantModule from "@/src/features/products/variants/variant-module";
import {Form} from "@/components/ui/form";

function Page() {
    const {currentAccount} = useAccountAtom();
    const t = useTranslations("product");

    const {mutate, isPending} = useMutation({
        mutationKey: ["create-product"],
        mutationFn: createProduct,
        onSuccess: () => {
            toast.success("Product created successfully");
            router.push("/products");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const router = useRouter();

    const form = useForm<Product>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            status: "published",
            category: "5",
            description: "",
            options: [],
            variants: [],
            documents: [],
        },
    });

    async function onSubmit(values: Product) {
        const payload = {
            ...values,
            accountId: currentAccount?.id,
        };

        payload.options = cleanOptionsValues(payload.options);

        console.log("payload", payload);

        const formData = jsonToFormData({
            name: payload.name,
            description: payload.description,
            status: payload.status,
            category: payload.category,
            price: payload.price,
            files: payload.files,
            options: payload.options,
            variants: payload.variants,
            accountId: payload.accountId,
        });

        console.log("formData", formData);

        mutate({
            data: formData,
            accountId: currentAccount?.id as string,
        });
    }

    return (
        <Form {...form}>
            <form suppressHydrationWarning onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mx-auto mt-4 grid flex-1 items-start  gap-4 p-4  sm:px-6 md:w-2/3 md:gap-8 ">
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 md:text-3xl">
                                {form.watch("name") || t("untitled")}
                            </h1>
                        </div>
                        <div className="grid auto-rows-max items-start gap-4 pt-10 lg:col-span-2 lg:gap-8">
                            <ProductDetails form={form}/>

                            <Price form={form}/>
                            <VariantModule form={form}/>
                        </div>

                        <div className="flex justify-end gap-2 pt-10 ">
                            <Button className="items-end" type="submit">
                                {t("addBtn")}
                                {isPending && (
                                    <Icons.spinner className="ml-2 h-4 w-4 animate-spin"/>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}

export default Page;
