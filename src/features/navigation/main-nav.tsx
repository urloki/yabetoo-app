"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigation } from "@/src/config/app-route";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function MainNav() {
  const pathname = usePathname();

  const t = useTranslations("navigation");
  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={isActive(item.href)}
                tooltip={t(item.name)}
                asChild
              >
                <Link
                  href={item.href}
                  className={cn(
                    //isActive(item.href)? "bg-primary font-bold" : "hover:text-primary dark:text-gray-400 hover:dark:text-gray-50",
                    "flex items-center gap-x-2.5 rounded-full px-2 py-1.5 text-sm font-medium transition hover:bg-primary-foreground",
                  )}
                >
                  <item.icon className="size-6 shrink-0" aria-hidden="true" />
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

export default MainNav;
