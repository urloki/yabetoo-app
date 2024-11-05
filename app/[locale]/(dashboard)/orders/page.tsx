"use client";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/icons";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getOrdersAction} from "@/src/actions/order/get-orders.action";
import {OrderDataTable} from "@/src/features/orders/table/data-table";
import { orderColumns } from "@/src/features/orders/table/column";

function Page() {
  const { currentAccount } = useAccountAtom();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", currentAccount?.id],
    queryFn: ({ queryKey }) => getOrdersAction(queryKey[1] as string),
  });
  return (
    <div className="my-20 flex h-screen flex-col sm:gap-4 sm:py-4 ">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
        </div>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}

        <OrderDataTable columns={orderColumns} data={data ?? []} />
      </main>
    </div>
  );
}

export default Page;
