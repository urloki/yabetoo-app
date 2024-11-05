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

import {AutoForm} from "@/components/ui/autoform";
import { Icons } from "@/components/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/src/providers/react-query-provider";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {getCountries} from "@/src/actions/entities/get-countries.action";
import {getMerchantDetail} from "@/src/actions/entities/get-merchant.action";
import {createAccount} from "@/src/actions/account/create-account.action";
import {ZodProvider} from "@autoform/zod";

function CreateAccountDialog({ onClose }: { onClose: () => void }) {
  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });
  const t = useTranslations("shop");

  const formSchema = z.object({
    name: z.string().describe(t("shopName")),
    //country: z.enum(countries?.map((country: any) => country.name)),
  });

   const schemaProvider = new ZodProvider(formSchema);

  const getCountryId = (code: string) => {
    return countries?.find(
      (country) => country.code.toLowerCase() === code.toLowerCase(),
    )?.id;
  };

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
    const merchant = await getMerchantDetail();
    const countryId = getCountryId(merchant.country.code);

    if (!countryId) {
      toast.error(t("shopCountryNotFoundError"));
      return;
    }

    const payload = {
      name: data.name as string,
      countryId: countryId,
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
        <AutoForm schema={schemaProvider} onSubmit={onSubmit}>
          <DialogFooter>
            <Button>
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("createShopBtn")}
            </Button>
          </DialogFooter>
        </AutoForm>
      </div>
    </DialogContent>
  );
}

export default CreateAccountDialog;
