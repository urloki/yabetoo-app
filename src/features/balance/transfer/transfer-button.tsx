"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Step, Stepper } from "@/components/ui/stepper";
import WithdrawOTPStep from "@/src/features/balance/withdraw/withdraw-otp-step";
import TransferRequestStep from "@/src/features/balance/transfer/transfer-request-step";

export const withdrawSteps = [
  {
    id: "1",
    label: "Demande de transfert",
    description: "Renseigner le montant à transférer",
  },
  {
    id: "2",
    label: "Confirmation",
  },
  {
    id: "3",
  },
];

function TransferButton({ balance }: { balance: number }) {
  const t = useTranslations("payment");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-fit rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          {t("requestTransfer")}
        </Button>
      </SheetTrigger>
      <SheetContent
        onClick={(e) => e.stopPropagation()}
        //className="sm:max-w-lg md:m-5 md:w-[700px]"
      >
        <SheetHeader className="text-start">
          <SheetTitle>Demande de transfert</SheetTitle>
        </SheetHeader>
        <Stepper
          variant="circle"
          orientation="vertical"
          initialStep={0}
          steps={withdrawSteps}
          responsive={true}
          className="mt-10"
          size="sm"
        >
          {withdrawSteps.map((stepProps, index) => {
            if (index === 0) {
              return (
                <Step key={stepProps.id} {...stepProps}>
                  <TransferRequestStep balance={balance} />
                </Step>
              );
            }
            if (index === 1) {
              return (
                <Step
                  key={stepProps.id}
                  {...stepProps}
                  description="Renseigner le code reçu par SMS ou par email"
                >
                  <WithdrawOTPStep />
                </Step>
              );
            }
            return (
              <Step
                key={stepProps.id}
                {...stepProps}
                label="En cours de traitement"
                state="loading"
                description="Votre demande de retrait est en cours de traitement"
              >
                <div className="px-2">
                  <p className="text-muted-foreground py-3 text-sm">
                    Nous avons bien reçu votre demande de retrait, ce dernier
                    est en cours de traitement. Vous recevrez un email/sms dès
                    que le retrait sera réalisé.
                  </p>
                </div>
              </Step>
            );
          })}
        </Stepper>
      </SheetContent>
    </Sheet>
  );
}

export default TransferButton;
