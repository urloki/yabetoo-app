import { Stepper } from "@stepperize/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { StepCircleIndicator } from "@/src/features/onboarding/stepper/stepper-circle-indicator";

function StepperHeader({ stepper }: { stepper: Stepper }) {
  return (
    <div className="fixed top-0 z-40 w-full bg-background p-5 md:top-10 md:w-72">
      <div className="mb-10 md:mb-16">back</div>
      {stepper.all.map((step, index, array) => (
        <div key={step.id} className="hidden w-fit flex-col md:flex">
          <div className="w-fit">
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-6 w-6 items-start justify-center rounded-full border-2 text-sm font-bold",
                    index <= stepper.current.index &&
                      "border-primary bg-primary text-white transition-all",
                    stepper.current.id === step.id &&
                      "border-primary bg-transparent text-primary",
                  )}
                >
                  {index != stepper.current.index &&
                    index <= stepper.current.index && (
                      <CheckIcon className="h-5 w-5 text-white" />
                    )}
                  {index >= stepper.current.index && <span>{index + 1}</span>}
                </div>
                {index !== array.length - 1 && (
                  <Separator
                    className={cn(
                      "h-6 w-0.5",
                      index <= stepper.current.index &&
                        "bg-primary transition-all",
                      stepper.current.id === step.id && "bg-gray-200",
                    )}
                  />
                )}
              </div>
              <div className="pt-1">
                <p className="text-sm font-bold">{step.title}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 md:hidden">
        <StepCircleIndicator
          currentStep={stepper.current.index + 1}
          totalSteps={stepper.all.length}
        />
        <div className="flex flex-col">
          <h2 className="flex-1 text-lg font-medium">
            {stepper.current.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {stepper.current.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StepperHeader;
