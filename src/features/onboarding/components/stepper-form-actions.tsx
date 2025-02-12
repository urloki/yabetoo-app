"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Icons } from "@/components/icons";
import { useOnboardingAtom } from "@/src/atoms/onboarding.atom";
import { useStepper } from "@/components/ui/stepper";

function StepperFormActions() {
  const { personalData } = useOnboardingAtom();
  const t = useTranslations("activateAccount");
  const { currentStep, steps, prevStep, isLastStep } = useStepper();
  const router = useRouter();

  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="linkHover1"
        onClick={() => {
          router.back();
        }}
      >
        {t("cancelBtn")}
      </Button>
      <div>
        <Button variant="outline" onClick={prevStep} className="mr-2">
          {t("prevBtn")}
        </Button>
        <Button type="submit" disabled={personalData.isLoading}>
          {currentStep === steps.length - 1 ? t("submitBtn") : t("nextBtn")}
          {!isLastStep && <ArrowRight className="ml-1 h-4 w-4" />}
          {personalData.isLoading && (
            <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default StepperFormActions;
