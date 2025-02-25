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
import { createOrganization } from "@/src/actions/organization/create-organization.action";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient } from "@/src/providers/react-query-provider";
import { createAccount } from "@/src/actions/account/create-account.action";
import { getAccounts } from "@/src/actions/account/get-accounts.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { transferAccountsOrganization } from "@/src/actions/organization/transfer-accounts-organization.action";
import { getCountries } from "@/src/actions/entities/get-countries.action";

const createOrganizationSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  accountName: z.string().max(50).optional(),
  countryId: z.string().min(1),
});

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>;

export default function CreateOrganizationPage() {
  const t = useTranslations("organization");
  const router = useRouter();

  const form = useForm<CreateOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      accountName: "",
      countryId: "",
    },
  });

  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const accountsWithoutOrg =
    accounts?.filter((account) => account.organizationId === null) || [];

  console.log("🔴 accountsWithoutOrg", accountsWithoutOrg);
  console.log("🔴 from err", form.formState.errors);

  const { mutate: createOrg, isPending } = useMutation({
    mutationKey: ["create-organization"],
    mutationFn: async (values: CreateOrganizationForm) => {
      // Create organization
      const orgResponse = await createOrganization({
        name: values.name,
        countryId: Number(values.countryId),
        description: values.description,
      });

      console.log("orgResponse", orgResponse);

      if (orgResponse) {
        if (accountsWithoutOrg.length > 0) {
          // Transfer accounts to the new organization
          await transferAccountsOrganization(orgResponse.id);
        } else {
          await createAccount({
            name: values.accountName as string,
            countryId: Number(values.countryId),
            organizationId: orgResponse.id,
          });
        }
      }
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

  const getErrorMessage = (error: any, field: keyof CreateOrganizationForm) => {
    if (!error) return "";

    switch (field) {
      case "name":
        return error.type === "too_small"
          ? t("nameMinLength")
          : t("nameMaxLength");
      case "description":
        return t("descriptionMaxLength");
      case "accountName":
        return error.type === "too_small"
          ? t("accountNameMinLength")
          : t("accountNameMaxLength");
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

    if (accountsWithoutOrg.length == 0 && !values.accountName) {
      toast.error(t("accountNameRequired"));
      return;
    }

    console.log("🔴 values", values);
    console.log("🔴 form err", form.formState.errors);

    createOrg(values);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl pt-20 md:pl-40">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">{t("details")}</h2>
          </div>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

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

              {accountsWithoutOrg.length == 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">{t("accountNameQuestion")}</h3>
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("accountNamePlaceholder")}
                            className="max-w-md"
                            {...field}
                          />
                        </FormControl>
                        {fieldState.error && (
                          <FormMessage>
                            {getErrorMessage(fieldState.error, "accountName")}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-medium">{t("locationQuestion")}</h3>
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid max-w-lg gap-2">
                          {countries?.map((country) => (
                            <button
                              type="button"
                              key={country.id}
                              className={cn(
                                "hover:bg-muted flex items-center justify-between rounded-lg border p-4 text-left text-sm transition-colors",
                                field.value === country.id.toString() &&
                                  "border-primary",
                              )}
                              onClick={() =>
                                field.onChange(country.id.toString())
                              }
                            >
                              <div className="flex items-center gap-3">
                                <span>{country.name}</span>
                              </div>
                              {field.value === country.id.toString() && (
                                <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
                                  ✓
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
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

            {accountsWithoutOrg.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("transferTitle")}</CardTitle>
                  <CardDescription className="space-y-4">
                    {t("transferExplanation")}
                  </CardDescription>
                  <CardDescription>
                    {t("transferDescription")} {form.watch("name")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="space-y-4">
                      {accountsWithoutOrg.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                          <span className="text-sm font-medium">
                            {account.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isPending || isLoadingCountries}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("createOrganization")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
