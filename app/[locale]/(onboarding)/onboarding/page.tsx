"use client";
import { defineStepper } from "@stepperize/react";
import BusinessType, {
  businessTypeSchema,
} from "@/src/features/onboarding/components/business-type";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOnboardingAtom } from "@/src/atoms/onboarding.atom";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import StepperHeader from "@/src/features/onboarding/stepper/stepper-header";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import PersonalInfo, {
  personalInfoSchema,
} from "@/src/features/onboarding/components/personal-info";
import BusinessInfo, {
  businessInfoSchema,
} from "@/src/features/onboarding/components/business-info";
import PayoutInfo, {
  payoutInfoSchema,
} from "@/src/features/onboarding/components/payout-info";
import DocumentsInfo, {
  documentInfoSchema,
} from "@/src/features/onboarding/components/document-info";
import { formatActivateAccountData } from "@/src/features/onboarding/utils/format-activate-account-data";
import { activateAccountAction } from "@/src/actions/account/activate-account.action";
import { queryClient } from "@/src/providers/react-query-provider";
import { toast } from "sonner";

function Page() {
  const t = useTranslations("activateAccount");
  const { useStepper } = defineStepper(
    {
      id: "businessType",
      title: t("businessType"),
      description: "Choisissez votre type d'entreprise",
      schema: businessTypeSchema,
    },
    {
      id: "personalInfo",
      title: t("personalDetails"),
      description: "Saisissez vos informations personnelles",
      schema: personalInfoSchema,
    },
    {
      id: "businessDetails",
      title: t("businessDetails"),
      description: "Complétez les informations de votre entreprise",
      schema: businessInfoSchema,
    },
    {
      id: "payoutMethod",
      title: t("payoutMethod"),
      description: "Saisissez vos informations de retrait",
      schema: payoutInfoSchema,
    },
    {
      id: "document",
      title: "Documents & Identité",
      description: "Renseignez vos documents d'identité & d'entreprise",
      schema: documentInfoSchema,
    },
  );
  const stepper = useStepper();
  const { personalData, updatePersonalData } = useOnboardingAtom();

  const { currentAccount, setCurrentAccount } = useAccountAtom();
  const router = useRouter();

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    values: {
      ...personalData,
      countryId: currentAccount?.countryId.toString() ?? "1",
      firstname: personalData.firstname ?? "",
      lastname: personalData.lastname ?? "",
      email: personalData.email ?? "",
      dateOfBirth: personalData.dateOfBirth ?? "",
      phoneNumber: personalData.phoneNumber ?? "",
      address: personalData.address ?? "",
      productDescription: personalData.productDescription ?? "",
      industry: personalData.industry ?? "",
      businessWebsite: personalData.businessWebsite ?? "",
      statementDescriptor: personalData.statementDescriptor ?? "",
      customerSupportPhoneNumber: personalData.customerSupportPhoneNumber ?? "",
      showCustomerSupportPhoneNumber:
        personalData.showCustomerSupportPhoneNumber ?? true,
      operatorId: personalData.operatorId ?? "",
      payoutPhoneNumber: personalData.payoutPhoneNumber ?? "",
      files: [],
      identityType: "identityCard",
    },
  });
  const onSubmit = async (values: z.infer<typeof stepper.current.schema>) => {
    console.log(`Form values for step ${stepper.current.id}:`, values);
    console.log("personalData", personalData);

    updatePersonalData({ ...values, currentStep: 1 });

    console.log("isLast", stepper.isLast);

    if (stepper.isLast) {
      //stepper.reset();
      console.log("last test");
      const formData = formatActivateAccountData(personalData, values);

      try {
        updatePersonalData({ isLoading: true });
        toast.promise(
          activateAccountAction({
            accountId: currentAccount?.id as string,
            formData,
          }),
          {
            success: (response) => {
              queryClient.invalidateQueries({
                queryKey: ["accounts"],
              });
              // @ts-ignore
              setCurrentAccount(response);
              updatePersonalData({ isLoading: false });
              router.push("/");
              return "Account activated successfully";
            },
            error: async (error) => {
              //Sentry.captureException(error);
              updatePersonalData({ isLoading: false });
              console.log(error);
              return "An error occurred while activating your account";
            },
          },
        );
      } catch (e) {
        console.log(e);
        toast.error("An error occurred while activating your account");
        updatePersonalData({ isLoading: false });
      }
    } else {
      stepper.next();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <StepperHeader stepper={stepper as never} />
          <div className="px-5 py-10 pt-52 md:ml-80 md:max-w-2xl md:px-10 md:pt-10">
            {stepper.switch({
              businessType: () => <BusinessType form={form as never} />,
              personalInfo: () => <PersonalInfo form={form as never} />,
              businessDetails: () => <BusinessInfo form={form as never} />,
              payoutMethod: () => <PayoutInfo form={form as never} />,
              document: () => <DocumentsInfo form={form as never} />,
            })}
            <div className="mt-8 flex gap-6">
              <Button
                variant="linkHover1"
                onClick={() => {
                  router.back();
                }}
              >
                {t("cancelBtn")}
              </Button>
              <div className="w-fit">
                {!stepper.isLast ? (
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={stepper.prev}
                      disabled={stepper.isFirst}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="expandIcon"
                      iconPlacement="right"
                      Icon={ArrowRightIcon}
                      type="submit"
                    >
                      {stepper.isLast ? "Valider" : "Suivant"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    disabled={personalData.isLoading}
                    className="flex items-center gap-2"
                    type="submit"
                  >
                    Valider
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default Page;
