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
import {Step, Stepper} from "@/components/ui/stepper";
import WithdrawOTPStep from "@/src/features/balance/withdraw/withdraw-otp-step";
import WithdrawRequestStep from "@/src/features/balance/withdraw/withdraw-request-step";

export const withdrawSteps = [
  {
    id: "1",
    label: "Demande de retrait",
    description: "Renseigner le montant à retirer",
  },
  {
    id: "2",
    label: "Confirmation",
  },
  {
    id: "3",
  },
];

function WithdrawButton({ balance }: { balance: number }) {
  const t = useTranslations("payment");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-fit rounded-full"
          onClick={(e) => e.stopPropagation()}
          variant="outline"
        >
          {t("requestWithdraw")}
        </Button>
      </SheetTrigger>
      <SheetContent
        onClick={(e) => e.stopPropagation()}
        //className="overflow-auto rounded-md border-none outline-none sm:max-w-lg md:m-5 md:w-[400px] w-[500px] xl:w-[600px]"
      >
        <SheetHeader>
          <SheetTitle>Demande de retrait</SheetTitle>
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
                  <WithdrawRequestStep balance={balance} />
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
                  <p className="py-3 text-sm text-muted-foreground">
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

export default WithdrawButton;
