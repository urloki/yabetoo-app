"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/icons";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { getProducts } from "@/src/actions/product/get-products";
import { ProductDataTable } from "@/src/features/products/table/data-table";
import { productColumns } from "@/src/features/products/table/column";

function Page() {
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("product");
  const { data, isLoading } = useQuery({
    queryKey: ["products", currentAccount?.id],
    queryFn: ({ queryKey }) => getProducts(queryKey[1] as string),
  });

  return (
    <div className="my-10 flex flex-col gap-4">
      <main className="flex flex-1 flex-col pt-6">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">{t("product")}</h1>
          <Link href={"/products/create"}>
            <Button size="sm" className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              {t("addBtn")}
            </Button>
          </Link>
        </div>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}

        <ProductDataTable columns={productColumns} data={data ?? []} />
      </main>
    </div>
  );
}

export default Page;
