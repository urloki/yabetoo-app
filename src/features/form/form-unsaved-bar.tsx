"use client";

import type { FormProps } from "@/components/ui/custom-form";
import { Form } from "@/components/ui/custom-form";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { createPortal } from "react-dom";
import type { FieldValues } from "react-hook-form";
import { useKey } from "react-use";
import { useWarnIfUnsavedChanges } from "@/hooks/use-warm-if-unsaved-changes";
import { Typography } from "@/components/ui/typography";
import { LoadingButton } from "@/src/features/form/submint-button";
import { useIsMobile } from "@/hooks/use-mobile";

export const FormUnsavedBar = <T extends FieldValues>(props: FormProps<T>) => {
  const barRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  const submit = () => buttonRef.current?.click();

  const isDirty = props.form.formState.isDirty;

  useKey(
    (event) => (event.ctrlKey || event.metaKey) && event.key === "s" && isDirty,
    submit,
    { event: "keydown" },
    [isDirty],
  );

  useWarnIfUnsavedChanges(
    isDirty,
    "You have unsaved changes. Are you sure you want to leave?",
  );

  if (typeof window === "undefined") return null;

  return (
    <>
      <Form {...props} className={cn(props.className)}>
        {props.children}
        <button type="submit" className="hidden" ref={buttonRef} />
      </Form>
      {createPortal(
        <div
          ref={barRef}
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center overflow-hidden py-4",
            isMobile && "w-full top-0",
          )}
        >
          <AnimatePresence>
            {isDirty ? (
              <motion.div
                key="save-bar"
                initial={{
                  opacity: 0,
                  y: isMobile ? -20 : 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: [1, 1, 0],
                  y: isMobile ? [0, 10, -20] : [0, -10, 20],
                  transition: {
                    duration: 0.5,
                  },
                }}
                className={cn(
                  "pointer-events-auto flex items-center gap-4 rounded-md border bg-card",
                  "p-1 lg:p-2",
                )}
              >
                {!isMobile && (
                  <Typography variant="small">
                    {props.description ??
                      "Vous avez des modifications non sauvegardées"}
                  </Typography>
                )}

                <div className="flex items-center gap-2">
                  <LoadingButton
                    variant="secondary"
                    className="w-full px-5"
                    onClick={() => {}}
                  >
                    Annuler
                  </LoadingButton>
                  <LoadingButton
                    loading={
                      props.disabled ?? props.form.formState.isSubmitting
                    }
                    className="w-full px-5"
                    onClick={() => {
                      submit();
                    }}
                  >
                    {props.btnText ?? "Sauvegarder"}
                  </LoadingButton>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
};
