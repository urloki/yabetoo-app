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
import WithdrawOTPStep from "@/src/features/balance/withdraw/withdraw-otp-step";
import WithdrawRequestStep from "@/src/features/balance/withdraw/withdraw-request-step";
import { defineStepper } from "@stepperize/react";
import { Typography } from "@/components/ui/typography";
import { steps } from "framer-motion";
import React from "react";
import { Separator } from "react-aria-components";

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
  const { useStepper, utils } = defineStepper(
    {
      id: "ask",
      title: "Demande de retrait",
      description: "Renseigner le montant à retirer",
    },
    {
      id: "confirm",
      title: "Confirmation",
      description: "Vérifier la demande de retrait",
    },
    {
      id: "status",
      title: "Status",
      description: "Votre demande de retrait est en cours de traitement",
    },
  );
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);

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
        //className="overflow-auto rounded-md border-none outline-hidden sm:max-w-lg md:m-5 md:w-[400px] w-[500px] xl:w-[600px]"
      >
        <SheetHeader>
          <SheetTitle>Demande de retrait</SheetTitle>
        </SheetHeader>
        {/* <Stepper
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
        </Stepper> */}

        <nav aria-label="Checkout Steps" className="group my-4">
          <ol className="flex flex-col gap-2" aria-orientation="vertical">
            {stepper.all.map((step, index, array) => (
              <React.Fragment key={step.id}>
                <li className="flex flex-shrink-0 items-center gap-4">
                  <Button
                    type="button"
                    role="tab"
                    variant={index <= currentIndex ? "default" : "secondary"}
                    aria-current={
                      stepper.current.id === step.id ? "step" : undefined
                    }
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    className="flex size-10 items-center justify-center rounded-full"
                  >
                    {index + 1}
                  </Button>
                  <div>
                    <Typography>{step.title}</Typography>
                    <Typography variant="muted">{step.description}</Typography>
                  </div>
                </li>
                <div className="flex gap-4">
                  {index < array.length - 1 && (
                    <div
                      className="flex justify-center"
                      style={{
                        paddingInlineStart: "1.25rem",
                      }}
                    >
                      <Separator
                        orientation="vertical"
                        className={`h-full w-[1px] ${
                          index < currentIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    </div>
                  )}
                  <div className="my-4 flex-1">
                    {stepper.current.id === step.id &&
                      stepper.switch({
                        ask: () => (
                          <WithdrawRequestStep
                            balance={balance}
                            stepper={stepper as never}
                          />
                        ),
                        confirm: () => (
                          <WithdrawOTPStep stepper={stepper as never} />
                        ),
                        status: () => (
                          <div className="px-2">
                            <p className="text-muted-foreground py-3 text-sm">
                              Nous avons bien reçu votre demande de retrait, ce
                              dernier est en cours de traitement. Vous recevrez
                              un email/sms dès que le retrait sera réalisé.
                            </p>
                          </div>
                        ),
                      })}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default WithdrawButton;
