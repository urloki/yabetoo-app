"use client";
import React from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {productsNavigation} from "@/src/config/app-route";
import {ChevronRight, CornerDownRight} from "lucide-react";
import {usePathname} from "next/navigation";
import {useShortcutsAtom} from "@/src/atoms/nav.atom";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {cn} from "@/lib/utils";

function ProductNav() {
    const pathname = usePathname();
    const isActive = (itemHref: string) => {
        return pathname === itemHref || pathname.startsWith(itemHref);
    };

    const {addShortcut} = useShortcutsAtom();
    const t = useTranslations("navigation");
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Services</SidebarGroupLabel>
            <SidebarMenu>
                {productsNavigation.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link
                                                    href={subItem.url}
                                                    onClick={() => {
                                                        addShortcut({
                                                            path: subItem.url,
                                                            label: subItem.title,
                                                            isPinned: false,
                                                        });
                                                    }}
                                                    className="flex h-8 min-w-8 items-center gap-3 overflow-hidden rounded-md px-2 text-sm font-medium text-muted-foreground ring-ring transition-all hover:text-primary focus-visible:ring-2 "
                                                >
                                                    <div
                                                        className={cn(
                                                            "line-clamp-1 pl-2",
                                                            isActive(subItem.url) && "text-primary",
                                                        )}
                                                    >
                                                        {t(subItem.title)}
                                                    </div>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export default ProductNav;