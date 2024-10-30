"use client";
import type * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LockIcon } from "lucide-react";
import logo from "@/public/2_LOGO.svg";
import logoWhite from "@/public/2_WHITELOGO.svg";
import Image from "next/image";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { PhoneInput } from "@/components/ui/phone-input";
import countryData from "@/src/config/country-data";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import {getCompagnies} from "@/src/actions/entities/get-compagnie.action";
import {getCities} from "@/src/actions/entities/get-cities.action";
import {Company} from "@/src/shemas/entities/compagnie.schema";
import {createMerchantSchema} from "@/src/shemas/entities/create-merchant.schema";
import {createMerchant} from "@/src/actions/entities/create-merchant.action";

function Page() {
  const router = useRouter();

  const { theme, systemTheme } = useTheme();
  // const [isPending, startTransition] = useTransition();
  const t = useTranslations("register");

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const { data: companies } = useQuery({
    queryKey: ["compagnies"],
    queryFn: () => getCompagnies(),
  });

    console.log("companies", companies);

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: () =>
      getCities({
        countryId: "",
      }),
  });

  const findCompany = (id: string): Company | undefined => {
    return companies?.values.find((company) => company.id === id);
  };

  const findCities = (countryId: string) => {
    return cities?.values.filter((city) => city.countryId === countryId);
  };

  const findCountry = (id: string) => {
    const compagnie = companies?.values.find((company) => company.id === id);

    return countryData.country.find(
      (c) => c.code === compagnie?.country.code.toLowerCase(),
    );
  };

  const form = useForm<z.infer<typeof createMerchantSchema>>({
    resolver: zodResolver(createMerchantSchema),
    defaultValues: {
      createdFromType: "signIn",
      role: "merchant",
      roles: [],
      documents: [],
      countryId: "",
      name: "",
      enable: true,
      signInSponsorCode: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: createMerchant,
    mutationKey: ["createMerchant"],
    onError: (e) => {
      console.log(e);
      toast.error(e.message);
      Sentry.captureException(e);
    },
    onSuccess: () => {
      toast.success(t("accountCreatedSuccess"));
      router.replace("/");
    },
  });

  const onSubmit = async (values: z.infer<typeof createMerchantSchema>) => {
    values.phone = values.phone.replace(/\s/g, "");
    values.countryId = findCompany(values.companyId)?.countryId as string;
    values.name = `${values.managerFirstName.trim()} ${values.managerName.trim()}`;
    console.log(values);

    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col justify-center">
            <Image
              src={isDark ? logoWhite : logo}
              alt={"logo"}
              width={150}
              height={10}
            />

            <Card className={"shadow-none"}>
              <CardHeader>
                <div className="flex flex-col space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {t("title")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t("description")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("country")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("countryPlaceholder")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies?.values.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="activitySector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("sector")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="legalForm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("legalForm")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="cityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("city")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={form.watch("companyId") == null}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("cityPlaceholder")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {findCities(
                                findCompany(form.watch("companyId"))
                                  ?.countryId as string,
                              )?.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="pt-5">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("address")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-6 pt-5 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="managerFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("firstName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="managerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("lastName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-6 pt-5 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="managerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")}</FormLabel>
                          <FormControl>
                            <Input type={"email"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phone")}</FormLabel>
                          <FormControl>
                            <PhoneInput
                              disabled={form.watch("companyId") == null}
                              format={
                                findCountry(form.watch("companyId"))?.format ??
                                ""
                              }
                              mask=" "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-5">
                <Button
                  size="lg"
                  type={"submit"}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <span>{t("registerBtn")}</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
            <p className="my-6 text-sm text-gray-500">
              {t("haveAccount")}{" "}
              <Link className="text-primary" href={"/login"}>
                {t("loginBtn")}
              </Link>
              .
            </p>
            <div className="pb-10">
              <Badge variant={"optional"} className={"py-1"}>
                <LockIcon className="mr-2 h-4 w-4" /> {t("securityTips")}
              </Badge>
              <p className="pt-3 text-sm text-gray-500">
                {t("securityTipsDescription")}
              </p>
            </div>
            <LocaleSwitcher />
            <div className="pt-7 text-sm text-gray-500">
              <span>{t("copyright")}</span>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default Page;
