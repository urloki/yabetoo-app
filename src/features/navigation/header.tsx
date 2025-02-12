"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShortcutButton } from "@/components/shortcut-button";

export default function Header() {
  const isMobile = useIsMobile();
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const { currentAccount } = useAccountAtom();

  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  const { theme, systemTheme } = useTheme();
  return (
    <header className="h-16">
      <div className="flex items-center justify-between px-5 pt-2 md:px-10">
        <div>
          <h1 className="text-2xl font-bold">{t(pathname.split("/")[1])}</h1>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="hidden md:block">
            <Link
              href="/developers"
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
          {!isMobile && <ShortcutButton />}
        </div>
      </div>
    </header>
  );
}
