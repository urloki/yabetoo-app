import * as React from "react";

import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";


interface Money {
  prefix: string;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
  type?: string;
}

const MoneyInput = React.forwardRef<HTMLInputElement, Money>(
  ({ className, type, prefix, placeholder, onChange, ...props }, ref) => {
    return (
      <NumericFormat
        prefix={`${prefix} `}
        displayType={"input"}
        getInputRef={ref}
        onValueChange={(values) => onChange(values.value)}
        placeholder={`${prefix} 0.00`}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm uppercase shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        thousandSeparator=" "
        {...props}
      />
    );
  },
);
MoneyInput.displayName = "Input";

export { MoneyInput };
