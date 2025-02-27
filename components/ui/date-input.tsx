"use client";
import React from "react";
import {
  DateField,
  DateFieldProps,
  DateInput,
  DateSegment,
  DateValue,
  FieldError,
  I18nProvider,
  Label,
  ValidationResult,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

interface MyDateFieldProps<T extends DateValue> extends DateFieldProps<T> {
  label?: string;
  className?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function InputDate<T extends DateValue>({
  className,
  errorMessage,
  name,
  label,
  ...props
}: MyDateFieldProps<T>) {
  const locale = useLocale();
  return (
    <I18nProvider locale={locale}>
      <DateField {...props}>
        <Label>{label}</Label>
        <DateInput
          className={cn(
            "flex h-9 w-fit items-center gap-1 rounded border border-input  bg-transparent px-1  py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          {(segment) => (
            <DateSegment
              className="rounded px-1 hover:bg-muted focus:bg-muted focus:outline-hidden"
              segment={segment}
            />
          )}
        </DateInput>
        <FieldError>{errorMessage}</FieldError>
      </DateField>
    </I18nProvider>
  );
}

export default InputDate;
