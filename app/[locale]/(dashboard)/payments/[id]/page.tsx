"use client";
import { useQuery } from "@tanstack/react-query";
import { numberFormat } from "@/lib/utils";
import { Banknote, Check, Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { format } from "@formkit/tempo";
import Loader from "@/components/loader";
import { useLocale, useTranslations } from "next-intl";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/ui/timeline";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { getIntentByIdAction } from "@/src/actions/intent/get-intent-by-id.action";
import Badge from "@/components/ui/badge/Badge";
import { useParams } from "next/navigation";

function Page() {
  const params = useParams<{ id: string }>();
  const { currentAccount } = useAccountAtom();
  const t = useTranslations("intent");
  const locale = useLocale();
  const { data, isLoading } = useQuery({
    queryKey: [
      "show-intent",
      params.id,
      currentAccount?.id,
      currentAccount?.isLive,
    ],
    queryFn: ({ queryKey }) =>
      getIntentByIdAction(
        queryKey[2] as string,
        queryKey[1] as string,
        queryKey[3] as boolean,
      ),
  });

  return (
    <Loader isLoading={isLoading}>
      <div className="mt-10">
        <div className={"flex items-center justify-between"}>
          <div
            className={"text-muted-foreground flex items-center gap-2 text-xs"}
          >
            <Banknote className="h-5 w-5" />
            <span className="uppercase">{t("payment")}</span>
          </div>
          <div className="text-muted-foreground flex gap-2 text-xs">
            <span className="sm:truncate">{data?.id}</span>
            <Copy
              onClick={() => {
                navigator.clipboard.writeText(data?.id as string).then(() => {
                  toast.message("Payment ID copied to clipboard");
                });
              }}
              className="h-4 w-4 cursor-pointer"
            />
          </div>
        </div>
        <div className={"flex items-center gap-4"}>
          <span className="text-2xl md:text-4xl">
            {numberFormat(data?.amount as number, data?.currency)}
          </span>
          <Badge
            className="flex items-center gap-1 text-xs"
            intent={
              data?.status === "succeeded"
                ? "success"
                : data?.status === "failed"
                  ? "danger"
                  : "gray"
            }
          >
            {t(data?.status)}{" "}
            {data?.status === "succeeded" && <Check className="h-3 w-3" />}
          </Badge>
        </div>
        <Separator className="my-5" />
        <div className="flex items-center gap-5 md:gap-10">
          <div className="flex flex-col">
            <span className="text-muted-foreground">{t("lastUpdate")}</span>
            <span>
              {format(
                data?.updatedAt as string,
                {
                  date: "medium",
                  time: "short",
                },
                locale,
              )}
            </span>
          </div>
          <Separator orientation="vertical" className="h-12" />
          <div className={"flex flex-col"}>
            <span className={"text-muted-foreground"}>{t("client")}</span>
            <span className={"text-primary"}>
              {data?.charges.find((charge) => charge.id === data?.chargeId)
                ?.paymentMethod.customer.lastName ?? "Unknown"}
            </span>
          </div>
          <Separator orientation={"vertical"} className={"h-12"} />
          <div className={"flex flex-col"}>
            <span className={"text-muted-foreground"}>
              {t("paymentMethod")}
            </span>
            <div className={"flex items-center gap-2"}>
              <Smartphone className={"h-4 w-4"} />
              <span>
                {data?.charges.find((charge) => charge.id === data?.chargeId)
                  ?.paymentMethod.msisdn ?? t("unknown")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="mb-2 flex flex-row items-center justify-between">
            <span className="text-xl font-bold">{t("chronology")}</span>
          </div>

          <Separator className={"my-4"} />

          <div className="mt-3 mb-3 flex flex-col">
            <Timeline className="p-0">
              {data?.charges.map((charge) => (
                <TimelineItem key={charge.id}>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon />
                    <TimelineTitle>
                      {charge.status === "succeeded" ? (
                        <span className="text-green-600">
                          {t("payment")} {t("succeeded")}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          {t("payment")} {t("failed")}
                        </span>
                      )}
                    </TimelineTitle>
                  </TimelineHeader>
                  <TimelineContent className="pl-7">
                    <TimelineDescription>
                      {format(
                        charge.createdAt,
                        {
                          date: "full",
                          time: "short",
                        },
                        locale,
                      )}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
              <TimelineItem>
                <TimelineHeader>
                  <TimelineIcon />
                  <TimelineTitle>{t("paymentStarted")}</TimelineTitle>
                </TimelineHeader>
                <TimelineContent className="pl-7">
                  <TimelineDescription>
                    {format(
                      data?.createdAt as string,
                      {
                        date: "full",
                        time: "short",
                      },
                      locale,
                    )}
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
          <Separator />
          <div className={"mt-10"}>
            <p className={"text-xl font-bold"}>{t("paymentDetail")}</p>
            <Separator className={"my-4"} />
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <p>{t("paymentAmount")}</p>
                <p>{numberFormat(data?.amount as number, data?.currency)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>{t("yabetooTraitementFee")}</p>
                <p>
                  -{" "}
                  {numberFormat(
                    data?.walletTransaction?.amountFee as number,
                    data?.currency,
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between font-bold">
                <p>{t("amountNet")}</p>
                <p>
                  {numberFormat(
                    data?.walletTransaction?.amountCaptured as number,
                    data?.currency,
                  )}
                </p>
              </div>
            </div>
          </div>
          {/*<Separator className={"my-4"} />
          <div className={"mt-10"}>
            <p className={"text-xl font-bold"}>Payment method</p>
            <Separator className={"my-4"} />
            <div className={"grid md:w-3/4 md:grid-cols-2"}>
              <div className={"grid w-64 grid-cols-2 grid-rows-3 pr-10"}>
                <p>Number</p>
                <p>
                  {
                    data?.charges.find((c) => c.id === data?.chargeId)
                      ?.paymentMethod.msisdn
                  }
                </p>
                <p>Type</p>
                <p>
                  {
                    data?.charges.find((c) => c.id === data?.chargeId)
                      ?.paymentMethod.type
                  }
                </p>
                <p>ID</p>
                <p className="truncate">
                  {
                    data?.charges.find((c) => c.id === data?.chargeId)
                      ?.paymentMethod.id
                  }
                </p>
              </div>
              <div className={"grid w-64 grid-cols-2 grid-rows-3"}>
                <p>Client</p>
                <p className={"truncate text-primary"}>
                  {
                    data?.charges.find((c) => c.id === data?.chargeId)
                      ?.paymentMethod.customer.id
                  }
                </p>
                <p>Origine</p>
                <div className={"flex items-center gap-3"}>
                  <p>
                    {
                      data?.charges.find((c) => c.id === data?.chargeId)
                        ?.paymentMethod.country
                    }
                  </p>
                  <Image
                    src={`https://flagsapi.com/${data?.charges
                      .find((c) => c.id === data?.chargeId)
                      ?.paymentMethod.country.toUpperCase()}/flat/64.png`}
                    alt={"flag"}
                    height={20}
                    width={20}
                  />
                </div>
                <p>Operator</p>
                <p className={"capitalize"}>
                  {
                    data?.charges.find((c) => c.id === data?.chargeId)
                      ?.paymentMethod.operator
                  }
                </p>
              </div>
            </div>
          </div>*/}
        </div>
      </div>
    </Loader>
  );
}

export default Page;
