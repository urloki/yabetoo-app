import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserDropdown from "@/src/features/navigation/user-dropdown";
import MainNav from "@/src/features/navigation/main-nav";
import AccountDropdown from "@/src/features/navigation/account-dropdown";
import PaymentNav from "@/src/features/navigation/payment-nav";
import { SupportNav } from "@/src/features/navigation/support-nav";
import { TestBanner } from "@/src/features/navigation/test-banner";

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <AccountDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <MainNav />
        <PaymentNav />
        <TestBanner className="mt-auto" />
        <SupportNav />
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
