"use client";
import { useStepper } from "@/components/ui/stepper";
import { useSetupAtom } from "@/src/atoms/setup.atom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function StepperFormActions() {
  const {
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
  } = useStepper();

  const { setup } = useSetupAtom();

  return (
    <div className="flex w-full gap-2 pt-10">
      {hasCompletedAllSteps ? (
        <Button size="sm" type="button" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          {!isDisabledStep && (
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              variant="secondary"
              type="button"
              className="rounded-full"
            >
              Précédent
            </Button>
          )}
          <Button
            variant="expandIcon"
            Icon={ArrowRightIcon}
            iconPlacement="right"
            className="rounded-full"
            type="submit"
          >
            {isLastStep ? "Valider" : "Suivant"}
            {setup.isSubmitting && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </>
      )}
    </div>
  );
}
