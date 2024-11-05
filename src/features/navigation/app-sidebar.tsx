import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import UserDropdown from "@/src/features/navigation/user-dropdown";
import MainNav from "@/src/features/navigation/main-nav";
import AccountDropdown from "@/src/features/navigation/account-dropdown";
import ProductNav from "@/src/features/navigation/product-nav";
import ShortcutNav from "@/src/features/navigation/shortcut-nav";

export function AppSidebar() {

    return (
        <Sidebar variant="flat" collapsible="icon" className="bg-background">
            <SidebarHeader className="mt-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <AccountDropdown/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="mt-5">
                <MainNav/>
                <ShortcutNav />
                <ProductNav/>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <UserDropdown/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
