import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { paymentLinkSchema } from "@/src/shemas/payments-link/payment-link.schema";

function OptionSelector({
  form,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
}) {
  const t = useTranslations("paymentLink");

  return (
    <div>
      <div>
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="mb-5 flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t("activateLink")}</FormLabel>
                <FormDescription>
                  {t("activateLinkDescription")}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="collectAddress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("collecteUserAddress")}</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="callToAction"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-2 py-5">
              <div className="w-fit min-w-[100px]">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">{t("pay")}</SelectItem>
                    <SelectItem value="2">{t("book")}</SelectItem>
                    <SelectItem value="3">{t("donate")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormLabel className={"w-full"}>{t("asCallToAction")}</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default OptionSelector;
