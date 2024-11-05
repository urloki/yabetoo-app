"use client";

import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getPaymentLinkOrder} from "@/src/actions/payment-links/order/get-payment-link-order.action";
import {PaymentLinkOrderDataTable} from "@/src/features/payments-link/orders/data-table";
import {paymentLinkOrderColumns} from "@/src/features/payments-link/orders/column";


function Page() {
  const { currentAccount } = useAccountAtom();

  const { data: orders, isPending } = useQuery({
    queryKey: ["payment-links-orders", currentAccount?.id],
    queryFn: ({ queryKey }) => getPaymentLinkOrder(queryKey[1] as string),
  });

  return (
    <Loader isLoading={isPending}>
      <div className="my-10">
        <div className="flex items-center justify-between pb-10">
          <h1 className=" text-3xl font-semibold">Vos commandes</h1>
        </div>
        <div>
          <PaymentLinkOrderDataTable
            columns={paymentLinkOrderColumns}
            data={orders ?? []}
          />
        </div>
      </div>
    </Loader>
  );
}

export default Page;
