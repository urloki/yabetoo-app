"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactCountryFlag from "react-country-flag";
import { Navigation } from "lucide-react";
import { Locale } from "@/app.config";

const getCountryName = (locale: string) => {
  switch (locale) {
    case "en":
      return "United States";
    case "fr":
      return "France";
    default:
      return "United States";
  }
};

const getLanguageName = (locale: string) => {
  switch (locale) {
    case "en":
      return "English";
    case "fr":
      return "Français";
    default:
      return "Français";
  }
};

function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = (locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-3">
          <Navigation className="h-4 w-4" />
          <span className="text-sm">
            {getLanguageName(locale)} ({getCountryName(locale)})
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuItem
          defaultChecked={locale === "en"}
          onClick={() => handleLocaleChange("en")}
          className="cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <ReactCountryFlag
              className="rounded-full"
              svg
              style={{
                width: "1.3em",
                height: "2em",
              }}
              countryCode="US"
            />
            <div>
              <span>United States</span>
              <div className="text-muted-foreground text-xs">English</div>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          defaultChecked={locale === "fr"}
          onClick={() => handleLocaleChange("fr")}
          className="cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <ReactCountryFlag
              className="rounded-full"
              svg
              style={{
                width: "1.3em",
                height: "2em",
              }}
              countryCode="FR"
            />
            <div>
              <span>France</span>
              <div className="text-muted-foreground text-xs">Français</div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LocaleSwitcher;
