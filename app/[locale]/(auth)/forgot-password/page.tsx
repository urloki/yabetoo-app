"use client";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { LockIcon } from "lucide-react";
import Image from "next/image";
import logo from "@/public/2_LOGO.svg";
import logoWhite from "@/public/2_WHITELOGO.svg";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {AutoForm} from "@/components/ui/autoform";
import {ZodProvider} from "@autoform/zod";
import {sendPasswordResetLink} from "@/src/actions/auth/send-password-reset-link.action";

function Page() {
  const { theme, systemTheme } = useTheme();
  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const t = useTranslations("login");

  const schema = z.object({
    username: z.string().describe(t("username")),
  });
  const schemaProvider = new ZodProvider(schema);

  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: sendPasswordResetLink,
    onSuccess: () => {
      toast.success(t("passwordResetLinkSent"));
      router.push("/login");
    },
    onError: () => {
      toast.error(t("passwordResetError"));
    },
  });


  return (
    <div className="md:pt-20">
      <div className="mx-auto flex flex-col px-5 pb-5 md:w-1/3 md:px-0 ">
        <Image
          src={isDark ? logoWhite : logo}
          alt={t("logoAlt")}
          width={100}
          height={10}
          className="ml-5"
        />

        <Card className="mt-2 rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("forgotPasswordTitle")}
            </CardTitle>
            <CardDescription>{t("forgotPasswordDescription")}</CardDescription>
          </CardHeader>

          <CardContent>
            <AutoForm  schema={schemaProvider} onSubmit={(data) => {
              mutate(data.username);
            }}>
              <div>
                <Button className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <span>{t("forgotPasswordButton")}</span>
                  )}
                </Button>
              </div>
            </AutoForm>
          </CardContent>
          <CardFooter className="m-3 flex items-center justify-center rounded-md bg-muted p-0 py-5">
            <p className="text-center text-sm text-gray-500">
              {t("noAccount")}{" "}
              <Link className="text-primary" href="/register">
                {t("signUpLink")}
              </Link>
              .
            </p>
          </CardFooter>
        </Card>

        <div className="mt-10 rounded-md border p-2">
          <Badge variant={"optional"} className={"py-1"}>
            <LockIcon className="mr-2 h-4 w-4" /> {t("securityTipBadge")}
          </Badge>
          <p className="pt-3 text-sm text-gray-500">{t("securityTip")}</p>
        </div>
        <div className="pt-5">
          <LocaleSwitcher />
        </div>
        <div className="pt-3 text-sm text-gray-500">
          <span>{t("copyright")}</span>
        </div>
      </div>
    </div>
  );
}

export default Page;
