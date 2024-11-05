"use client";
import React from "react";
import {useIsMobile} from "@/hooks/use-mobile";
import {useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {useTheme} from "next-themes";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {ShortcutButton} from "@/components/shortcut-button";
import {Separator} from "@/components/ui/separator";
import {MoveUpRight} from "lucide-react";

export default function Header() {
    const isMobile = useIsMobile();
    const t = useTranslations("navigation");
    const pathname = usePathname();
    const {currentAccount} = useAccountAtom();

    const isActive = (itemHref: string) => {
        return pathname === itemHref || pathname.startsWith(itemHref);
    };

    const {theme, systemTheme} = useTheme();
    return (
        <header className="sticky top-0 flex shrink-0 bg-background flex-col">
            <div className="w-full rounded-lg mt-5 pb-2">
                <div className="flex items-end justify-between text-sm">
                    <p className="text-orange-600">{t("testMode")}</p>
                    <p>{t("testMessage")}</p>
                    <Link className="flex items-center gap-2" href="/onboarding">
                        {t("completeProfile")} <MoveUpRight className="h-4 w-4"/>
                    </Link>
                </div>
                <Separator className="mt-2 bg-orange-600"/>
            </div>
            <div className="flex items-center justify-between pt-5">
                <div>
                    <h1 className="text-2xl font-bold">
                        {t(pathname.split("/")[1])}
                    </h1>
                </div>
                <div className="flex items-center gap-5 text-sm">
                    <div className="hidden md:block">
                        <Link
                            href="/developer"
                            className={cn(
                                isActive("/developers")
                                    ? "text-primary"
                                    : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                                "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:text-primary",
                            )}
                        >
                            {t("developers")}
                        </Link>
                    </div>
                    {!isMobile && <ShortcutButton/>}
                </div>
            </div>

        </header>
    );
}
