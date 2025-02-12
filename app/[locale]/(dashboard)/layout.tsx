import { Locale } from "@/app.config";
import LoadData from "@/components/load-data";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/src/features/navigation/app-sidebar";
import Header from "@/src/features/navigation/header";

type Props = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};
const DashboardLayout: React.FC<Props> = async ({ children }) => {
  return (
    <ConfirmDialogProvider>
      <LoadData>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex w-full flex-1 flex-col">
              <SidebarTrigger className="fixed top-1/2 ml-1 hidden hover:bg-transparent md:block" />
              <Header />
              <div className="flex-1 overflow-y-auto px-5 py-10 md:px-10">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </LoadData>
    </ConfirmDialogProvider>
  );
};
export default DashboardLayout;
