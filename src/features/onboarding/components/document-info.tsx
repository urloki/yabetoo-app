"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { FileUploader } from "@/components/file-uploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

export const documentInfoSchema = z
  .object({
    files: z
      .array(z.instanceof(File))
      .refine((files) => {
        return files.length > 0;
      })
      .describe("You need to upload at least one document"),
    identityType: z.string(),
    idCardFront: z
      .array(z.instanceof(File))
      .refine((files) => {
        return files.length > 0;
      })
      .describe("You need to upload at least one document"),
    idCardBack: z.array(z.instanceof(File)).optional(),
  })
  .superRefine((value, context) => {
    if (value.idCardFront == null || value.idCardFront.length === 0) {
      context.addIssue({
        code: "custom",
        message: "You need to upload at least one document",
        path: ["idCardFront"],
      });
    }

    if (value.idCardBack) {
      if (value.identityType !== "passport" && value.idCardBack.length === 0) {
        context.addIssue({
          code: "custom",
          message: "You need to upload at least one document",
          path: ["idCardBack"],
        });
      }
    }
  });

function DocumentsInfo({
  form,
}: {
  form: UseFormReturn<z.infer<typeof documentInfoSchema>>;
}) {
  const t = useTranslations("activateAccount");

  return (
    <div className="w-full">
      <p className="pb-10 text-xl font-bold">{t("identityTypeDescription")}</p>

      <div className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="identityType"
          defaultValue={form.watch("identityType")}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("identityType")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-3"
                >
                  <FormItem
                    className={cn(
                      "flex items-center space-x-3 space-y-0 rounded-md border p-5",
                      field.value === "identityCard" && "border-primary",
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem value="identityCard" />
                    </FormControl>
                    <FormLabel className="truncate text-xs md:text-sm">
                      {t("identityCard")}
                    </FormLabel>
                  </FormItem>
                  <FormItem
                    className={cn(
                      "flex items-center space-x-3 space-y-0 rounded-md border p-5",
                      field.value === "driverLicense" && "border-primary",
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem value="driverLicense" />
                    </FormControl>
                    <FormLabel className="truncate text-xs font-normal md:text-sm">
                      {t("driverLicense")}
                    </FormLabel>
                  </FormItem>
                  <FormItem
                    className={cn(
                      "flex items-center space-x-3 space-y-0 rounded-md border p-5",
                      field.value === "passport" && "border-primary",
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem value="passport" />
                    </FormControl>
                    <FormLabel className="truncate text-xs font-normal md:text-sm">
                      {t("passport")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            form.watch("identityType") === "passport" && "grid-cols-1 gap-0",
          )}
        >
          <FormField
            control={form.control}
            name="idCardFront"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Recto</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={1}
                      maxSize={4 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          {form.watch("identityType") !== "passport" && (
            <FormField
              control={form.control}
              name="idCardBack"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Verso</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          )}
        </div>

        <p className="pt-10">{t("document")}</p>

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>
                  Upload your business registration documents
                </FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={4}
                    maxSize={4 * 1024 * 1024}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
      </div>
      <Alert variant="warning" className="my-10">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>{t("warningFraudAlert")}</AlertTitle>
        <AlertDescription className="mt-5">
          {t("warningFraudAlertDescription")}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default DocumentsInfo;
