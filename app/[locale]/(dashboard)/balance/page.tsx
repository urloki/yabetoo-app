"use client";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getAccountBalance } from "@/src/actions/account/get-account-balance.action";
import Loader from "@/components/loader";
import { numberFormat } from "@/lib/utils";
import WithdrawButton from "@/src/features/balance/withdraw/withdraw-button";
import TransferButton from "@/src/features/balance/transfer/transfer-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletTransactionDataTable } from "@/src/features/balance/wallet-transaction-table/data-table";
import { walletTransactionColumns } from "@/src/features/balance/wallet-transaction-table/column";
import { WithdrawDataTable } from "@/src/features/balance/withdraw-table/data-table";
import { withdrawColumns } from "@/src/features/balance/withdraw-table/column";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Page() {
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("payment");

  const { data: balance, isLoading } = useQuery({
    queryKey: ["account-balance", currentAccount?.id, currentAccount?.isLive],
    queryFn: ({ queryKey }) =>
      getAccountBalance(queryKey[1] as string, queryKey[2] as boolean),
  });
  return (
    <Loader isLoading={isLoading}>
      <>
        <div className="w-full pb-5">
          <div className="bg-background flex justify-between gap-4 rounded-md border p-2 py-5">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">{t("balance")}</p>
              </div>
              <div className="text-2xl font-medium">
                {numberFormat(
                  balance?.balance ?? 0,
                  currentAccount?.country.currency.code,
                )}
              </div>
              <span className="text-muted-foreground text-xs">
                {t("estimatedWithdraw")}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <WithdrawButton balance={balance?.balance ?? 0} />
              <TransferButton balance={balance?.balance ?? 0} />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Tabs defaultValue="transactions">
            <TabsList className="mb-5 bg-transparent">
              <TabsTrigger value="transactions">
                {t("transactions")}
              </TabsTrigger>
              <TabsTrigger value="withdrawals">{t("withdrawals")}</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <Card className="dark:bg-sidebar dark:border-none">
                <CardHeader>
                  <CardTitle>{t("transactions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletTransactionDataTable
                    columns={walletTransactionColumns}
                    data={balance?.transactions ?? []}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value={"withdrawals"}>
              <WithdrawDataTable
                columns={withdrawColumns}
                data={balance?.withdraws ?? []}
              />
            </TabsContent>
          </Tabs>
        </div>
      </>
    </Loader>
  );
}

export default Page;
