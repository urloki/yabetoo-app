"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCountries } from "@/src/actions/entities/get-countries.action";
import { createOrganization } from "@/src/actions/organization/create-organization.action";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient } from "@/src/providers/react-query-provider";
import { useAccountAtom } from "@/src/atoms/account.atom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const createOrganizationSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  countryId: z.string().min(1),
});

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>;

export default function LinkOrganizationPage() {
  const t = useTranslations("organization");
  const router = useRouter();
  const { accounts } = useAccountAtom();

  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const { mutate: createOrg, isPending } = useMutation({
    mutationKey: ["create-organization"],
    mutationFn: async (values: CreateOrganizationForm) => {
      // Create organization
      const orgResponse = await createOrganization({
        name: values.name,
        countryId: Number(values.countryId),
        description: values.description,
      });

      // TODO: Link existing accounts to the new organization
      console.log(
        "Link accounts to organization",
        accounts?.map((a) => a.id),
        "to organization",
        orgResponse.id,
      );
    },
    onSuccess: async () => {
      toast.success(t("success"));
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      router.push("/");
    },
    onError: (error) => {
      toast.error(t("error"));
      console.error(error);
    },
  });

  const form = useForm<CreateOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      countryId: "",
    },
  });

  const getErrorMessage = (error: any, field: keyof CreateOrganizationForm) => {
    if (!error) return "";

    switch (field) {
      case "name":
        return error.type === "too_small"
          ? t("nameMinLength")
          : t("nameMaxLength");
      case "description":
        return t("descriptionMaxLength");
      case "countryId":
        return t("countryRequired");
      default:
        return error.message;
    }
  };

  function onSubmit(values: CreateOrganizationForm) {
    if (!values.countryId) {
      toast.error(t("countryRequired"));
      return;
    }
    createOrg(values);
  }

  if (!accounts?.length) {
    return (
      <div className="container max-w-3xl pt-20 md:pl-40">
        <Card>
          <CardHeader>
            <CardTitle>{t("noAccountsTitle")}</CardTitle>
            <CardDescription>{t("noAccountsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/org")}>
              {t("createOrganization")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl pt-20 md:pl-40">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">{t("linkDetails")}</h2>
          </div>
          <p className="text-muted-foreground">{t("linkDescription")}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("existingAccounts")}</CardTitle>
            <CardDescription>{t("accountsToLink")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4">
              <div className="space-y-4">
                {accounts?.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-medium">{account.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">{t("nameQuestion")}</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={t("namePlaceholder")}
                          className="max-w-md"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>
                          {getErrorMessage(fieldState.error, "name")}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">{t("descriptionQuestion")}</h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("descriptionPlaceholder")}
                          className="max-w-md"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>
                          {getErrorMessage(fieldState.error, "description")}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">{t("locationQuestion")}</h3>
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <select
                          className={cn(
                            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full max-w-md rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                          )}
                          disabled={isLoadingCountries}
                          {...field}
                        >
                          <option value="">{t("selectCountry")}</option>
                          {countries?.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>
                          {getErrorMessage(fieldState.error, "countryId")}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("createButton")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
