"use client";
import React from 'react';
import {useAccountAtom} from "@/src/atoms/account.atom";
import {useTranslations} from "next-intl";
import {useQuery} from "@tanstack/react-query";
import {getAccountBalance} from "@/src/actions/account/get-account-balance.action";
import Loader from "@/components/loader";
import {numberFormat} from "@/lib/utils";
import WithdrawButton from "@/src/features/balance/withdraw/withdraw-button";
import TransferButton from "@/src/features/balance/transfer/transfer-button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {WalletTransactionDataTable} from "@/src/features/balance/wallet-transaction-table/data-table";
import {walletTransactionColumns} from "@/src/features/balance/wallet-transaction-table/column";
import {WithdrawDataTable} from "@/src/features/balance/withdraw-table/data-table";
import {withdrawColumns} from "@/src/features/balance/withdraw-table/column";

function Page() {
    const {currentAccount} = useAccountAtom();
    const t = useTranslations("payment");

    const {data: balance, isLoading} = useQuery({
        queryKey: ["account-balance", currentAccount?.id, currentAccount?.isLive],
        queryFn: ({queryKey}) =>
            getAccountBalance(queryKey[1] as string, queryKey[2] as boolean),
    });
    return (
        <Loader isLoading={isLoading}>
            <div>
                <div className="mt-10 pb-5 w-full">
                    <div className="flex gap-4 rounded-md border bg-background p-2 py-5 justify-between">

                        <div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{t("balance")}</p>
                            </div>
                            <div className="text-2xl font-medium">
                                {numberFormat(
                                    balance?.balance ?? 0,
                                    currentAccount?.country.currency.code,
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{t("estimatedWithdraw")}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <WithdrawButton balance={balance?.balance ?? 0}/>
                            <TransferButton balance={balance?.balance ?? 0}/>
                        </div>

                    </div>
                </div>
                <div className="w-full">
                    <Tabs defaultValue="transactions">
                        <TabsList className="mb-5  bg-transparent">
                            <TabsTrigger value="transactions">
                                {t("transactions")}
                            </TabsTrigger>
                            <TabsTrigger value="withdrawals">
                                {t("withdrawals")}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="transactions">
                            <WalletTransactionDataTable
                                columns={walletTransactionColumns}
                                data={balance?.transactions ?? []}
                            />
                        </TabsContent>
                        <TabsContent value={"withdrawals"}>
                            <WithdrawDataTable
                                columns={withdrawColumns}
                                data={balance?.withdraws ?? []}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Loader>
    );
}

export default Page;