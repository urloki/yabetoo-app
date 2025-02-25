"use client";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Icons } from "@/components/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/src/providers/react-query-provider";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createAccount } from "@/src/actions/account/create-account.action";
import { getCountries } from "@/src/actions/entities/get-countries.action";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1),
});

function CreateAccountDialog({ onClose }: { onClose: () => void }) {
  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });
  const t = useTranslations("shop");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { currentOrganization } = useAccountAtom();

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onSuccess: async () => {
      toast.success(t("shopSuccess"));
      await queryClient.refetchQueries({
        queryKey: ["accounts"],
      });
      onClose();
    },
    onError: () => {
      toast.error(t("shopError"));
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      name: data.name,
      countryId: currentOrganization?.countryId as number,
      organizationId: currentOrganization?.id as string,
    };
    mutate(payload);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("createShop")} </DialogTitle>
        <DialogDescription>{t("shopDescription")}</DialogDescription>
      </DialogHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("shopName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("shopName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("createShopBtn")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}

export default CreateAccountDialog;
