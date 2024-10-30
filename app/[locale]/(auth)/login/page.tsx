"use client";
import React, {useState, useTransition} from 'react';
import {useTheme} from "next-themes";
import {useTranslations} from "next-intl";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import Image from "next/image";
import logo from "@/public/2_LOGO.svg";
import logoWhite from "@/public/2_WHITELOGO.svg";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {LockIcon} from "lucide-react";
import LocaleSwitcher from "@/components/locale-switcher";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import {loginAction} from "@/src/actions/auth/login.action";
import {toast} from "sonner";

function Page() {
    const [isError, setIsError] = useState<boolean>(false);
    const {theme, systemTheme} = useTheme();
    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

    const [isPending, startTransition] = useTransition();
    const t = useTranslations("login");

    const loginSchema = z.object({
        username: z.string().describe(t("username")),
        password: z.string().min(6).max(6).describe(t("password")),
    });
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        localStorage.clear();
        setIsError(false);
        startTransition(() => {
            loginAction(values).then((res) => {
                if (res?.error) {
                    toast.error(res.error);
                }
            });
        });
    }

    return (
        <div className="md:pt-20">
            <div className="mx-auto flex flex-col px-5 pb-5 md:w-1/3 md:px-0 ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div >
                            <Image
                                src={isDark ? logoWhite : logo}
                                alt={t("logoAlt")}
                                width={100}
                                height={10}

                            />
                            <Card className="mt-2 rounded-md">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    {isError && (
                                        <div className={"pb-5"}>
                                            <Alert variant="destructive">
                                                <ExclamationTriangleIcon className="h-4 w-4"/>
                                                <AlertTitle>{t("errorTitle")}</AlertTitle>
                                                <AlertDescription>{t("errorDescription")}</AlertDescription>
                                            </Alert>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t("username")}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t("username")} {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t("password")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder={t("password")} {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className=" mt-5">
                                        <Link className="pt-2 text-indigo-500" href="/forgot-password">
                                            {t("forgotPassword")}
                                        </Link>
                                    </div>
                                    <div className="mt-10">
                                        <Button className="w-full" disabled={isPending}>
                                            {isPending ? (
                                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                            ) : (
                                                <span>{t("loginButton")}</span>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter
                                    className="m-3 flex items-center justify-center rounded-md bg-muted p-0 py-5">
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
                    </form>
                </Form>
            </div>

        </div>
    );
}

export default Page;