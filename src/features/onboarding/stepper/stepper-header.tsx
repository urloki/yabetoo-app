import { Stepper } from "@stepperize/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { StepCircleIndicator } from "@/src/features/onboarding/stepper/stepper-circle-indicator";
import { Utils } from "@stepperize/core";
import { Typography } from "@/components/ui/typography";

function StepperHeader({ stepper, utils }: { stepper: Stepper; utils: Utils }) {
  const currentIndex = utils.getIndex(stepper.current.id);
  return (
    <div className="bg-background fixed z-40 w-full p-5 md:w-72">
      {stepper.all.map((step, index, array) => (
        <div key={step.id} className="my-2 hidden w-fit flex-col md:flex">
          <div className="w-fit">
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-6 w-6 items-start justify-center rounded-full border-2 text-sm font-bold",
                    index <= currentIndex &&
                      "border-primary bg-primary text-white transition-all",
                    stepper.current.id === step.id &&
                      "border-primary text-primary bg-transparent",
                  )}
                >
                  {index != currentIndex && index <= currentIndex && (
                    <CheckIcon className="h-5 w-5 text-white" />
                  )}
                  {index >= currentIndex && <span>{index + 1}</span>}
                </div>
                {index !== array.length - 1 && (
                  <Separator
                    className={cn(
                      "my-4 h-6 w-0.5",
                      index <= currentIndex && "bg-primary transition-all",
                      stepper.current.id === step.id && "bg-gray-200",
                    )}
                  />
                )}
              </div>
              <div className="pt-1">
                {/*<p className="text-sm font-bold">{step.title}</p>*/}
                <Typography className="font-bold">{step.title}</Typography>
                <Typography variant="muted">{step.description}</Typography>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 md:hidden">
        <StepCircleIndicator
          currentStep={currentIndex + 1}
          totalSteps={stepper.all.length}
        />
        <div className="flex flex-col">
          <h2 className="flex-1 text-lg font-medium">
            {stepper.current.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {stepper.current.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StepperHeader;
