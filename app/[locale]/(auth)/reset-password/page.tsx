"use client";
import * as z from "zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {AutoForm} from "@/components/ui/autoform";
import {buildZodFieldConfig} from "@autoform/react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import {LockIcon} from "lucide-react";
import Image from "next/image";
import logo from "@/public/2_LOGO.svg";
import logoWhite from "@/public/2_WHITELOGO.svg";
import {useTheme} from "next-themes";
import {useTranslations} from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import {useMutation} from "@tanstack/react-query";
import {useRouter, useSearchParams} from "next/navigation";
import {resetPassword} from "@/src/actions/auth/reset-password.action";
import {ZodProvider} from "@autoform/zod";
import React from "react";

const fieldConfig = buildZodFieldConfig();

function Page() {
    const {theme, systemTheme} = useTheme();
    const isDark =
        theme === "dark" || (theme === "system" && systemTheme === "dark");

    const t = useTranslations("login");
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("token");
    const phone = searchParams.get("number");

    const schema = z.object({
        password: z.string().min(6).max(6).describe(t("password")).superRefine(
            fieldConfig({
                inputProps: {
                    type: "password",
                },
            })
        ),
        confirmPassword: z.string().min(6).max(6).describe(t("confirmPassword")).superRefine(
            fieldConfig({
                inputProps: {
                    type: "password",
                },
            })
        ),
    });
    const schemaProvider = new ZodProvider(schema);

    const {isPending, mutate} = useMutation({
        mutationKey: ["reset-password"],
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success(t("passwordResetSuccess"));
            router.push("/login");
        },
        onError: () => {
            toast.error(t("passwordResetError"));
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        if (values.password !== values.confirmPassword) {
            toast.error(t("passwordMismatch"));
            return;
        }

        if (!resetToken) {
            toast.error("Token de réinitialisation de mot de passe non trouvé.");
        }

        mutate({
            password: values.password,
            token: resetToken?.replaceAll(" ", "+") as string,
            number: phone as string,
            confirmPassword: values.confirmPassword,
        });
    };

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
                            {t("resetPasswordTitle")}
                        </CardTitle>
                        <CardDescription>{t("resetPasswordDescription")}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <AutoForm
                            schema={schemaProvider}
                            onSubmit={onSubmit}
                        >
                            <div>
                                <Button className="w-full" disabled={isPending}>
                                    {isPending ? (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <span>{t("resetPasswordButton")}</span>
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
                        <LockIcon className="mr-2 h-4 w-4"/> {t("securityTipBadge")}
                    </Badge>
                    <p className="pt-3 text-sm text-gray-500">{t("securityTip")}</p>
                </div>
                <div className="pt-5">
                    <LocaleSwitcher/>
                </div>
                <div className="pt-3 text-sm text-gray-500">
                    <span>{t("copyright")}</span>
                </div>
            </div>
        </div>
    );
}

export default Page;
