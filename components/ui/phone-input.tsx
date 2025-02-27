import * as React from "react";
import { PatternFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import type { InternalNumberFormatBase } from "react-number-format/types/types";

interface Phone extends InternalNumberFormatBase {
  format: string;
  mask: string;
  className?: string;
  disabled?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, Phone>(
  ({ className, format, disabled, mask, ...props }, ref) => {
    return (
      <PatternFormat
        format={format}
        mask={mask}
        disabled={disabled}
        allowEmptyFormatting
        getInputRef={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "Input";

export { PhoneInput };
