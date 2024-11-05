"use client";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {useAccountAtom} from "@/src/atoms/account.atom";
import Link from "next/link";
import {getPaymentLinksAction} from "@/src/actions/payment-links/get-payment-links.action";
import {PaymentLinkDataTable} from "@/src/features/payments-link/table/data-table";
import {paymentLinkColumns} from "@/src/features/payments-link/table/column";

function Page() {
  const { currentAccount } = useAccountAtom();
  const { data, isLoading } = useQuery({
    queryKey: ["payment-links", currentAccount?.id, currentAccount?.isLive],
    queryFn: ({ queryKey }) =>
      getPaymentLinksAction(queryKey[1] as string, queryKey[2] as boolean),
  });
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <main className="flex flex-1 flex-col pt-6">
        <div className="flex items-center justify-between pb-10">
          <div></div>
          <Link href="/payment-links/new">
            <Button className="rounded-xl" size="sm">
              Créer un lien de paiement
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}

        <PaymentLinkDataTable columns={paymentLinkColumns} data={data ?? []} />
      </main>
    </div>
  );
}

export default Page;
