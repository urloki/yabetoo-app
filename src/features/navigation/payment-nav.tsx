"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { payments } from "@/src/config/app-route";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function PaymentNav() {
  const pathname = usePathname();

  const t = useTranslations("navigation");
  const isActive = (itemHref: string) => {
    return pathname === itemHref;
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paiements</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {payments.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton isActive={isActive(item.href)} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-2.5 px-2 py-1.5 text-sm font-medium transition",
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {t(item.name)}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default PaymentNav;
