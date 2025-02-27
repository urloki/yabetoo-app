import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { z } from "zod";
import { FileUploader } from "@/components/file-uploader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Trash } from "lucide-react";
import { paymentLinkSchema } from "@/src/shemas/payments-link/payment-link.schema";
import { useConfirm } from "@/components/ui/confirm-dialog";

function CreateLinkChooseWhatToPay({
  form,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
}) {
  const t = useTranslations("paymentLink");

  const confirm = useConfirm();

  const deleteImage = async (key: string) => {
    const isConfirmed = await confirm({
      title: "Delete Item",
      description: "Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (isConfirmed) {
      // Perform delete action
      console.log("Delete image with key:", key);
    }
  };

  return (
    <div className="pt-5">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          {t("customerChooseWhatToPay")}
        </legend>
        <div className="grid gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {t("description")}{" "}
                  <Badge className="ml-2" variant={"optional"}>
                    Optional
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Give customers more detail about what they're paying for"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isLimited"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("setLimits")}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("isLimited") && (
            <div className="flex gap-3 pl-7">
              <FormField
                control={form.control}
                name="limits.min"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("minAmount")}</FormLabel>
                    <FormControl>
                      <Input type={"number"} min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="limits.max"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("maxAmount")}</FormLabel>
                    <FormControl>
                      <Input type={"number"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </fieldset>
      <fieldset className="mt-10 grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Images</legend>
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {form.watch("documents")?.map((doc) => (
            <div key={doc.key}>
              <div className="flex items-center gap-4">
                <Image src={doc.url} alt={doc.key} width={100} height={100} />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground truncate text-sm">
                    {doc.name}
                  </p>
                  <Button
                    variant="warning"
                    size="iconSm"
                    className="rounded-full text-xs"
                    type="button"
                    onClick={() => deleteImage(doc.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default CreateLinkChooseWhatToPay;
