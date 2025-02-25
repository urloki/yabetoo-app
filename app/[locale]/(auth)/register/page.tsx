"use client";
import { z } from "zod";

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
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import { createMerchant } from "@/src/actions/entities/create-merchant.action";
import { PhoneInput } from "@/components/phone-input";

// create user schema

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
      });
    }
  });

function Page() {
  const router = useRouter();

  const { theme, systemTheme } = useTheme();
  // const [isPending, startTransition] = useTransition();
  const t = useTranslations("register");

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
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

  const onSubmit = async (values: z.infer<typeof schema>) => {
    console.log("okkk");
    values.phoneNumber = values.phoneNumber.replace(/\D/g, "");
    console.log(values);

    mutate(values);
  };

  console.log(form.formState.errors);

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
                  <p className="text-muted-foreground text-sm">
                    {t("description")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 pt-5 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
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
                      name="lastName"
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
                      name="email"
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
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phone")}</FormLabel>
                          <FormControl>
                            <PhoneInput {...field} defaultCountry="CG" />
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input type={"password"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
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
                  type="submit"
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
