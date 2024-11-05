import {Locale} from "@/app.config";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import {AppSidebar} from "@/src/features/navigation/app-sidebar";
import LoadData from "@/components/load-data";
import Header from "@/src/features/navigation/header";
import {ConfirmDialogProvider} from "@/components/ui/confirm-dialog";

type Props = {
    children: React.ReactNode;
    params: {
        locale: Locale;
    };
};
const DashboardLayout: React.FC<Props> = async ({children}) => {
    return (
        <ConfirmDialogProvider>
            <LoadData>
                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <SidebarTrigger className="top-1/2 fixed hover:bg-transparent hidden md:block ml-1"/>
                        <div className="flex flex-1 flex-col gap-4 px-10">
                            <Header/>
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </LoadData>
        </ConfirmDialogProvider>
    );
};
export default DashboardLayout;
