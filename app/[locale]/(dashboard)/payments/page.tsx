"use client";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/icons";

import { useTranslations } from "next-intl";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getIntentsAction} from "@/src/actions/intent/get-intents.action";
import {IntentDataTable} from "@/src/features/intents/table/data-table";
import { intentColumns } from "@/src/features/intents/table/column";

function Page() {
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("payment");
  const { data, isLoading } = useQuery({
    queryKey: ["payments", currentAccount?.id, currentAccount?.isLive],
    queryFn: ({ queryKey }) =>
      getIntentsAction(queryKey[1] as string, queryKey[2] as boolean),
  });

  return (
    <div className="my-10 flex flex-1 flex-col gap-4 ">
      <div className="pb-5">
        <p className="pt-2 text-sm text-gray-500">{t("paymentDescription")}</p>
      </div>
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      <div>
        <IntentDataTable columns={intentColumns} data={data ?? []} />
      </div>
    </div>
  );
}

export default Page;
