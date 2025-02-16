"use client";
import { MoveUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAccountAtom } from "@/src/atoms/account.atom";
import Link from "next/link";
import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";

export function TestBanner({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { currentAccount } = useAccountAtom();
  const { state } = useSidebar();
  const t = useTranslations("navigation");

  if (state === "collapsed") return null;

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <div>
            {!currentAccount?.isLive && (
              <div>
                <Card className="border-none bg-orange-600 text-white shadow-none dark:bg-orange-800">
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle className="py-3">{t("testMode")}</CardTitle>
                    <CardDescription className="text-white">
                      {t("testMessage")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <Link
                      className="flex items-center gap-2"
                      href="/onboarding"
                    >
                      <Button size="sm" className="w-full rounded-full text-xs">
                        {t("completeProfile")}{" "}
                        <MoveUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
