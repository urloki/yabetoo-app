"use client";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import { describeProducts, numberFormat } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Analytics from "@/src/features/payments-link/analytics";
import { getPaymentLinkByIdAction } from "@/src/actions/payment-links/get-payment-link-by-id.action";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { QRCodeSVG } from "qrcode.react";
import { Product } from "@/src/shemas/payments-link/schema";
import React from "react";

const getCartTotal = (products: Array<Product>) => {
  return products.reduce((acc, product) => {
    return acc + Number.parseInt(product.price) * product.quantity;
  }, 0);
};

function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use<{ id: string }>(params);
  const { currentAccount } = useAccountAtom();
  const { data, isLoading } = useQuery({
    queryKey: [
      "show-payment-link",
      id,
      currentAccount?.id,
      currentAccount?.isLive,
    ],
    queryFn: ({ queryKey }) =>
      getPaymentLinkByIdAction(
        queryKey[2] as string,
        queryKey[1] as string,
        queryKey[3] as boolean,
      ),
  });
  return (
    <Loader isLoading={isLoading}>
      <div className="mt-5 flex flex-col pb-5">
        <div>
          <span className="text-sm uppercase text-muted-foreground">
            Payment link
          </span>
          <p>
            <span className="text-2xl font-bold">
              {describeProducts(data?.products ?? [])}
            </span>
            <span className="ml-2 text-gray-500">for</span>
            <span className="ml-2 text-muted-foreground">
              {numberFormat(
                getCartTotal(data?.products ?? []),
                currentAccount?.country.currency.code,
              )}
            </span>
          </p>
          <p className="mt-2 text-muted-foreground">
            Copy and share to start accepting payments with this link.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <Badge variant="optional">
            <span className="truncate text-sm font-bold"> {data?.url}</span>{" "}
            <ClipboardList className="ml-2 h-4 w-4" />{" "}
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="xs">
                <Scan className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="px-0 sm:max-w-[425px]">
              <DialogHeader className="px-5">
                <DialogTitle>Your QR code</DialogTitle>
              </DialogHeader>

              <div className="bg-muted">
                <div className="m-10 flex flex-col items-center rounded-lg bg-primary p-10">
                  <div className="mb-5 rounded-lg bg-white p-5">
                    <QRCodeSVG
                      size={256}
                      id={data?.id as string}
                      className={"rounded-lg"}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={data?.url as string}
                    />
                  </div>
                  <span className="text-white dark:text-black">
                    Scan to pay
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="pt-10">
          <Analytics link={data} />
          {/*<Tabs defaultValue="analytics">
            <TabsList variant="underline" width="full">
              <TabsTrigger width="fit" variant="underline" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger width="fit" variant="underline" value="analytics">
                Payments and analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Overview link={data} />
            </TabsContent>
            <TabsContent value="analytics">
              <Analytics link={data} />
            </TabsContent>
          </Tabs>*/}
        </div>
      </div>
    </Loader>
  );
}

export default Page;
