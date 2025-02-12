"use client";
import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useNavMobileSidebarAtom,
  useShortcutsAtom,
} from "@/src/atoms/nav.atom";
import { Clock1Icon, PinIcon } from "lucide-react";

function ShortcutNav() {
  const pathname = usePathname();
  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };
  const { shortcuts, togglePin } = useShortcutsAtom();
  const t = useTranslations("navigation");
  const { toggleNavMobileSidebar } = useNavMobileSidebarAtom();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white">Raccourcis</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {shortcuts
            .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
            .map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.path}
                    onClick={() => {
                      toggleNavMobileSidebar();
                    }}
                    className={cn(
                      isActive(item.path)
                        ? "bg-primary"
                        : "hover:text-primary dark:text-gray-400 hover:dark:text-gray-50",
                      "flex items-center gap-x-2.5 px-2 py-1.5 text-sm font-medium transition hover:dark:bg-gray-900",
                    )}
                  >
                    {item.isPinned ? (
                      <PinIcon className="h-4 w-4 rotate-45" />
                    ) : (
                      <Clock1Icon className="h-4 w-4" />
                    )}
                    <div className="flex w-full items-center justify-between">
                      {t(item.label)}
                    </div>
                  </Link>
                  {/*{item.isPinned ? (
                                            <Tooltip delayDuration={1}>
                                                <TooltipTrigger asChild>
                                                    <X
                                                        onClick={() => {
                                                            togglePin(item);
                                                        }}
                                                        className="h-4 w-4 cursor-pointer"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent side={"right"}>
                                                    <p>Unpin shortcut</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip delayDuration={1}>
                                                <TooltipTrigger asChild>
                                                    <PinIcon
                                                        onClick={() => {
                                                            togglePin(item);
                                                        }}
                                                        className="h-4 w-4 cursor-pointer"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent side={"right"}>
                                                    <p>Pin shortcut</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}*/}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default ShortcutNav;
