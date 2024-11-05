import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StepSharedProps } from "./types";
import { useStepper } from "./use-stepper";

type StepButtonContainerProps = StepSharedProps & {
  children?: React.ReactNode;
};

const StepButtonContainer = ({
  isCurrentStep,
  isCompletedStep,
  children,
  isError,
  isLoading: isLoadingProp,
  onClickStep,
  state,
}: StepButtonContainerProps) => {
  const {
    clickable,
    isLoading: isLoadingContext,
    variant,
    styles,
  } = useStepper();

  const currentStepClickable = clickable || !!onClickStep;

  const isLoading = isLoadingProp || isLoadingContext;

  if (variant === "line") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      type="button"
      tabIndex={currentStepClickable ? 0 : -1}
      /*className={cn(
        "stepper__step-button-container",
        "pointer-events-none rounded-full p-0",
        "h-[var(--step-icon-size)] w-[var(--step-icon-size)]",
        "flex items-center justify-center rounded-full border-2",
        "data-[clickable=true]:pointer-events-auto",
        "data-[active=true]:border-green-500 data-[active=true]:bg-green-500 data-[active=true]:text-primary-foreground",
        "data-[current=true]:border-primary data-[current=true]:bg-secondary",
        "data-[invalid=true]:border-destructive data-[invalid=true]:bg-destructive data-[invalid=true]:text-destructive-foreground",
        styles?.["step-button-container"],
      )}*/
      className={cn(
        "stepper__step-button-container",
        "pointer-events-none rounded-full p-0 ",
        "h-[var(--step-icon-size)] w-[var(--step-icon-size)]",
        "flex items-center justify-center rounded-full border-2",
        "data-[clickable=true]:pointer-events-auto",
        isCompletedStep &&
          "border-green-500 bg-green-500 text-primary-foreground",
        isCurrentStep &&
          state === "error" &&
          "border-red-500 bg-red-500 text-primary-foreground",
        styles?.["step-button-container"],
      )}
      aria-current={isCurrentStep ? "step" : undefined}
      data-current={isCurrentStep}
      data-invalid={isError && (isCurrentStep || isCompletedStep)}
      data-active={isCompletedStep}
      data-clickable={currentStepClickable}
      data-loading={isLoading && (isCurrentStep || isCompletedStep)}
    >
      {children}
    </Button>
  );
};

export { StepButtonContainer };
