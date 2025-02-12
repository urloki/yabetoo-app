"use client";

import { defineStepper } from "@stepperize/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import AccountNameForm, {
  accountNameFormSchema,
} from "@/src/features/setup/account-name-form";
import ChangePasswordForm, {
  changePasswordFormSchema,
} from "@/src/features/setup/change-password-form";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetupAtom } from "@/src/atoms/setup.atom";
import { z } from "zod";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { FlipWords } from "@/components/ui/flip-words";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCountries } from "@/src/actions/entities/get-countries.action";
import { useTranslations } from "next-intl";
import { changePassword } from "@/src/actions/account/change-password.action";
import { getMerchantDetail } from "@/src/actions/entities/get-merchant.action";
import { toast } from "sonner";
import { createAccount } from "@/src/actions/account/create-account.action";
import { signOut } from "next-auth/react";
import { Loader } from "@/components/ui/loader";

const { useStepper, steps } = defineStepper(
  {
    id: "createAccount",
    title: "Boutique",
    description: "Entrez les détails de votre boutique",
    schema: accountNameFormSchema,
  },
  {
    id: "changePassword",
    title: "Mot de passe",
    description: "Changez votre mot de passe par défaut",
    schema: changePasswordFormSchema,
  },
);
const words = ["vendre..", "facturer..", "créer.."];

function Page() {
  const stepper = useStepper();
  const { setup, updateSetup } = useSetupAtom();
  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      name: setup.name,
      oldPassword: setup.oldPassword,
      newPassword: setup.newPassword,
      confirmPassword: setup.confirmPassword,
    },
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });
  const t = useTranslations("shop");

  const getCountryId = (code: string) => {
    return countries?.find(
      (country) => country.code.toLowerCase() === code.toLowerCase(),
    )?.id;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: async () => {
      const merchant = await getMerchantDetail();
      const countryId = getCountryId(merchant.country.code);

      if (!countryId) {
        toast.error(t("shopCountryNotFoundError"));
        return;
      }

      const payloadShop = {
        name: setup.name as string,
        countryId: countryId,
      };
      createAccount(payloadShop).then(async (r) => {
        console.log(r);
        if (r.error) {
          toast.error(r.error);
          return;
        }
        toast.success(
          "Mot de passe changé avec succès, vous allez être redirigé vers la page de connexion",
        );
        await signOut();
      });
    },
    onError: () => {
      toast.error("Erreur lors du changement de mot de passe");
      updateSetup({
        isSubmitting: false,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    if (stepper.isLast) {
      // @ts-expect-error - oldPassword, newPassword and confirmPassword are required fields
      const { oldPassword, newPassword, confirmPassword } = values;
      updateSetup({
        isSubmitting: true,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      mutate({
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
    } else {
      if (stepper.current.id === "createAccount") {
        // @ts-expect-error - name is a required field
        const { name } = values;
        updateSetup({ name: name });
      }
      stepper.next();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 px-5 pt-10">
          <div>
            <Typography
              className="text-xl font-normal text-neutral-600 dark:text-neutral-400 md:text-4xl"
              variant="h2"
            >
              Plus que deux étapes pour pouvoir commencer à
              <FlipWords words={words} />
            </Typography>
          </div>
          <div>
            <div className="flex pt-10">
              {stepper.all.map((step, index, array) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2",
                      index <= stepper.current.index && "border-primary",
                    )}
                  >
                    <Button
                      type="button"
                      role="tab"
                      size="icon"
                      variant={
                        index <= stepper.current.index ? "default" : "secondary"
                      }
                      aria-current={
                        stepper.current.id === step.id ? "step" : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      className="flex size-5 items-center justify-center rounded-full"
                    >
                      {index + 1}
                    </Button>
                    <span
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                        index <= stepper.current.index && "text-black",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < array.length - 1 && (
                    <div
                      className={cn(
                        "w-20 border-b",
                        index < stepper.current.index && "border-primary",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="pt-10">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Étape {stepper.current.index + 1} / {steps.length}
                </span>
              </div>
              <Typography variant="h3">
                {stepper.current.description}
              </Typography>
              <Separator className="mt-4" />
            </div>
          </div>
          <div>
            {stepper.switch({
              // @ts-expect-error - createAccount is a required field
              createAccount: () => <AccountNameForm form={form} />,
              // @ts-expect-error - changePassword is a required field
              changePassword: () => <ChangePasswordForm form={form} />,
            })}
            {!stepper.isLast ? (
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                >
                  Précédent
                </Button>
                <Button
                  variant="expandIcon"
                  iconPlacement="right"
                  type="submit"
                  Icon={ArrowRightIcon}
                >
                  {stepper.isLast ? "Valider" : "Suivant"}
                </Button>
              </div>
            ) : (
              <Button
                className="flex items-center gap-2"
                type="submit"
                disabled={isPending}
              >
                {isPending && <Loader />} Valider
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}

export default Page;
