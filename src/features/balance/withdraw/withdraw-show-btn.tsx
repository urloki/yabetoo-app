"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Step, Stepper } from "@/components/ui/stepper";

import { Avatar } from "@/components/ui/avatar";
import { RiMoneyDollarBoxLine } from "@remixicon/react";
import { getBadgeVariant, numberFormat } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import DateComponent from "@/components/date-component";
import {Withdraw} from "@/src/shemas/account/account-balance.schema";
import {useAccountAtom} from "@/src/atoms/account.atom";
import Badge from "@/components/ui/badge/Badge";
import {withdrawSteps} from "@/src/features/balance/withdraw/withdraw-button";
import WithdrawRequestStep from "@/src/features/balance/withdraw/withdraw-request-step";
import WithdrawOTPStep from "@/src/features/balance/withdraw/withdraw-otp-step";

const getInitialStep = (status: string) => {
  switch (status) {
    case "requires_confirmation":
      return 1;
    case "processing":
      return 2;
    default:
      return 2;
  }
};

const getStepDescription = (status: string) => {
  switch (status) {
    case "requires_confirmation":
      return "Renseigner le code reçu par SMS ou par email";
    case "processing":
      return "Vous recevrez un email d'informations";
    case "canceled":
      return "Votre demande de retrait a été annulée";
    default:
      return "Votre demande de retrait à été traitée";
  }
};

const getStepMessage = (status: string) => {
  switch (status) {
    case "requires_confirmation":
      return "Renseigner le code reçu par SMS ou par email";
    case "failed":
      return "Votre demande de retrait a échoué. Merci de contacter le support pour plus d'informations.";
    case "processing":
      return "Nous avons bien reçu votre demande de retrait, ce dernier est en cours de traitement. Vous recevrez un email/sms dès que le retrait sera réalisé.";
    case "canceled":
      return "Votre demande de retrait a été annulée elle ne sera donc pas traitée.";
    default:
      return "Votre demande de retrait à été traitée avec succès. Nous vous avons envoyé un email/sms de confirmation.";
  }
};

const getStepState = (status: string) => {
  switch (status) {
    case "requires_confirmation":
      return "loading";
    case "failed":
      return "error";
    case "processing":
      return "loading";
    case "canceled":
      return "error";
    default:
      return "loading";
  }
};

function WithdrawShowBtn({ withdraw }: { withdraw: Withdraw }) {
  console.log(withdraw);
  //const t = useTranslations("payment");
  const { currentAccount } = useAccountAtom();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div onClick={(e) => e.stopPropagation()} className="hover:text-primary">
          Voir le détail
        </div>
      </SheetTrigger>
      <SheetContent
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[540px]"
      >
        <SheetHeader>
          <SheetTitle>
            {withdraw.object === "withdraw"
              ? "Demande de retrait"
              : "Transfert"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-10">
          <div className="flex items-center gap-4">
            <Avatar className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground text-white">
              <RiMoneyDollarBoxLine />
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                {withdraw.object === "withdraw"
                  ? "Montant retiré"
                  : "Montant transferé"}
              </p>
              <p className="text-xl font-bold">
                {numberFormat(
                  withdraw.amount,
                  currentAccount?.country.currency.code,
                )}
              </p>
            </div>
          </div>
          <Separator className="my-5" />
          <div>
            <p className="mb-5 text-sm font-bold">Détails du retrait</p>
            <div className="my-2 flex items-center justify-between">
              <p>Statut</p>
              <p className="items-end text-sm text-muted-foreground">
                <Badge intent={getBadgeVariant(withdraw.status)}>
                  {withdraw.status}
                </Badge>
              </p>
            </div>
            <div className="my-2 flex items-center justify-between">
              <p>Date de la demande</p>
              <p className="items-end text-sm text-muted-foreground">
                <DateComponent date={withdraw.createdAt} />
              </p>
            </div>
            <div className="my-2 flex items-center justify-between">
              <p>Date d&apos;exécution</p>
              <p className="items-end text-sm text-muted-foreground">
                {withdraw.executedAt ? (
                  <DateComponent date={withdraw.executedAt} />
                ) : (
                  <span>Non exécuté</span>
                )}
              </p>
            </div>
          </div>
          <Separator className="my-5" />
          {withdraw.object === "transfer" && (
            <div>
              <div className="my-2 flex items-center justify-between">
                <p>Nom</p>
                <p className="items-end text-sm text-muted-foreground">
                  {withdraw.firstName}
                </p>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p>Prénom</p>
                <p className="items-end text-sm text-muted-foreground">
                  {withdraw.lastName}
                </p>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p>Téléphone</p>
                <p className="items-end text-sm text-muted-foreground">
                  {withdraw.phone}
                </p>
              </div>
              <Separator className="my-5" />
            </div>
          )}
          <p className="mb-5 text-sm font-bold">Timeline</p>
        </div>

        <Stepper
          variant="circle"
          orientation="vertical"
          initialStep={getInitialStep(withdraw.status)}
          steps={withdrawSteps}
          responsive={true}
          className="mt-5"
          size="sm"
        >
          {withdrawSteps.map((stepProps, index) => {
            if (index === 0) {
              return (
                <Step key={stepProps.id} {...stepProps}>
                  <WithdrawRequestStep balance={0} />
                </Step>
              );
            }
            if (index === 1) {
              return (
                <Step
                  key={stepProps.id}
                  state={getStepState(withdraw.status)}
                  {...stepProps}
                  description={
                    withdraw.status === "requires_confirmation"
                      ? "Renseigner le code reçu par SMS ou par email"
                      : withdraw.status === "canceled"
                        ? "Votre demande de retrait a été annulée"
                        : "Votre demande de retrait à été confirmée"
                  }
                >
                  <WithdrawOTPStep id={withdraw.id} />
                </Step>
              );
            }
            if (index === 2) {
              return (
                <Step
                  isCompletedStep={withdraw.status === "succeeded"}
                  label="Statut de retrait"
                  description={getStepDescription(withdraw.status)}
                  state={getStepState(withdraw.status)}
                  key={stepProps.id}
                  {...stepProps}
                >
                  <div className="px-2">
                    <p className="py-3 text-sm text-muted-foreground">
                      {getStepMessage(withdraw.status)}
                    </p>
                  </div>
                </Step>
              );
            }
          })}
        </Stepper>
      </SheetContent>
    </Sheet>
  );
}

export default WithdrawShowBtn;
