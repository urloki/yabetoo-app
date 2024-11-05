"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import ProductDetails from "@/src/features/products/components/product-details";
import Price from "@/src/features/products/components/price";
import { useTranslations } from "next-intl";
import { cleanOptionsValues } from "@/lib/utils";
import Loader from "@/components/loader";
import { FormUnsavedBar } from "@/src/features/form/form-unsaved-bar";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getProductById} from "@/src/actions/product/get-product-by-id";
import {updateProduct} from "@/src/actions/product/update-product";
import {Product, productSchema} from "@/src/shemas/product/product.schema";
import {jsonToFormData} from "@/lib/json-to-form-data";
import VariantModule from "@/src/features/products/variants/variant-module";
import ProductImage from "@/src/features/products/modules/product-image";

function Page({ params }: { params: { id: string } }) {
  const { currentAccount } = useAccountAtom();
  const router = useRouter();
  const t = useTranslations("product");

  const { data, isLoading } = useQuery({
    queryKey: ["show-product", params.id, currentAccount?.id],
    queryFn: ({ queryKey }) =>
      getProductById(queryKey[2] as string, queryKey[1] as string),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-product"],
    mutationFn: updateProduct,
    onSuccess: async () => {
      toast.success("Product updated successfully");
      router.push("/products");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    values: {
      name: data?.name as string,
      status: "published",
      description: data?.description as string,
      price: data?.price as string,
      category: data?.category as string,
      variants: data?.variants ?? [],
      options: data?.options ?? [],
      documents: data?.documents ?? [],
      files: [],
    },
  });

  async function onSubmit(values: Product) {
    values.options = cleanOptionsValues(values.options);

    const formData = jsonToFormData({
      name: values.name,
      description: values.description,
      status: values.status,
      category: values.category,
      price: values.price,
      files: values.files,
      options: values.options,
      variants: values.variants,
      accountId: currentAccount?.id,
    });

    mutate({
      accountId: currentAccount?.id as string,
      id: params.id,
      data: formData,
    });
  }

  return (
    <Loader isLoading={isLoading}>
      <FormUnsavedBar form={form} onSubmit={onSubmit} btnText="Mofidier">
        <div className="flex flex-col">
          <main className="my-5 grid flex-1 items-start gap-4 overflow-y-auto ">
            <div className=" grid flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <Link href={"/products"}>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  {form.watch("name") || t("untitled")}
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button size="sm" type="submit" className="rounded-xl">
                    Modifier
                    {isPending && (
                      <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <ProductDetails form={form} />
                  <Price form={form} />
                  <VariantModule form={form} />
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <ProductImage form={form} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button  type="submit">
                  Modifier
                </Button>
              </div>
            </div>
          </main>
        </div>
      </FormUnsavedBar>
    </Loader>
  );
}

export default Page;
