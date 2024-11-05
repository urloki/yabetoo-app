"use client";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getCustomersAction} from "@/src/actions/customers/get-customers.action";
import {CustomerDataTable} from "@/src/features/customers/table/data-table";
import {customerColumns} from "@/src/features/customers/table/column";

function Page() {
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("customer");
  const { data, isLoading } = useQuery({
    queryKey: ["customers", currentAccount?.id, currentAccount?.isLive],
    queryFn: ({ queryKey }) =>
      getCustomersAction(queryKey[1] as string, queryKey[2] as boolean),
  });
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <main className="flex flex-1 flex-col gap-4 pt-6">
        <div className="pb-5">
          <h1 className="text-3xl font-bold">{t("customer")}</h1>
          <p className="pt-2 text-sm text-gray-500">
            {t("customerDescription")}
          </p>
        </div>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}

        <CustomerDataTable columns={customerColumns} data={data ?? []} />
      </main>
    </div>
  );
}

export default Page;
