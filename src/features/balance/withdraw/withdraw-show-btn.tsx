"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { getBadgeVariant, numberFormat } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import DateComponent from "@/components/date-component";
import { Withdraw } from "@/src/shemas/account/account-balance.schema";
import { useAccountAtom } from "@/src/atoms/account.atom";
import Badge from "@/components/ui/badge/Badge";
import WithdrawOTPStep from "./withdraw-otp-step";
import { defineStepper } from "@stepperize/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const getInitialStep = (status: string) => {
  switch (status) {
    case "requires_confirmation":
      return "confirm";
    case "processing":
      return "status";
    default:
      return "status";
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
  //const t = useTranslations("payment");
  const { currentAccount } = useAccountAtom();

  const { useStepper, utils } = defineStepper(
    {
      id: "ask",
      title: "Demande de transfert",
      description: "Renseigner le montant à transférer",
    },
    {
      id: "confirm",
      title: "Confirmation",
      description: "Vérifier la demande de transfert",
    },
    {
      id: "status",
      title: "Status",
      description: "Votre demande de transfert est en cours de traitement",
    },
  );
  const initialStep = getInitialStep(withdraw.status);
  console.log(initialStep);
  const stepper = useStepper({
    initialStep,
  });

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          onClick={(e) => e.stopPropagation()}
          className="hover:text-primary"
        >
          Voir le détail
        </div>
      </SheetTrigger>
      <SheetContent onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <SheetTitle>
            {withdraw.object === "withdraw"
              ? "Demande de retrait"
              : "Transfert"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-muted-foreground text-sm">
                {withdraw.object === "withdraw"
                  ? "Montant retiré"
                  : "Montant transferé"}
              </p>
              <Typography variant="h1">
                {numberFormat(
                  withdraw.amount,
                  currentAccount?.country.currency.code,
                )}
              </Typography>
            </div>
          </div>
          <Separator className="my-5" />
          <Card>
            <CardHeader>
              <CardTitle>Informations de la demande</CardTitle>
              <CardDescription>
                Vous trouvez ci-dessous les informations relatives au transfert
                effectué.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p className="mb-5 text-sm font-bold">Détails du retrait</p>
                <div className="my-2 flex items-center justify-between">
                  <p>Statut</p>
                  <p className="text-muted-foreground items-end text-sm">
                    <Badge intent={getBadgeVariant(withdraw.status)}>
                      {withdraw.status}
                    </Badge>
                  </p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p>Date de la demande</p>
                  <p className="text-muted-foreground items-end text-sm">
                    <DateComponent date={withdraw.createdAt} />
                  </p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p>Date d&apos;exécution</p>
                  <p className="text-muted-foreground items-end text-sm">
                    {withdraw.executedAt ? (
                      <DateComponent date={withdraw.executedAt} />
                    ) : (
                      <span>Non exécuté</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {withdraw.object === "transfer" && (
            <Card className="mt-5">
              <CardHeader>
                <CardTitle>Informations du transfert</CardTitle>
                <CardDescription>
                  Vous trouvez ci-dessous les informations relatives au
                  transfert effectué.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="my-2 flex items-center justify-between">
                    <p>Nom</p>
                    <p className="text-muted-foreground items-end text-sm">
                      {withdraw.firstName}
                    </p>
                  </div>
                  <div className="my-2 flex items-center justify-between">
                    <p>Prénom</p>
                    <p className="text-muted-foreground items-end text-sm">
                      {withdraw.lastName}
                    </p>
                  </div>
                  <div className="my-2 flex items-center justify-between">
                    <p>Téléphone</p>
                    <p className="text-muted-foreground items-end text-sm">
                      {withdraw.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{stepper.current.title}</CardTitle>
            <CardDescription>{stepper.current.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {stepper.switch({
              ask: () => <div>ok</div>,
              confirm: () => <WithdrawOTPStep stepper={stepper as never} />,
              status: () => (
                <div className="px-2">{getStepMessage(withdraw.status)}</div>
              ),
            })}
          </CardContent>
        </Card>

        {/* <Stepper
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
                    <p className="text-muted-foreground py-3 text-sm">
                      {getStepMessage(withdraw.status)}
                    </p>
                  </div>
                </Step>
              );
            }
          })}
        </Stepper> */}
      </SheetContent>
    </Sheet>
  );
}

export default WithdrawShowBtn;
