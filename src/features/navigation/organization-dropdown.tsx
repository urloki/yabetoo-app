"use client";

import { useEffect, useState } from "react";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Account } from "@/src/shemas/account/account.schema";
import { Card } from "@/components/ui/card";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/src/providers/react-query-provider";
import { cn } from "@/lib/utils";
import { useNavMobileSidebarAtom } from "@/src/atoms/nav.atom";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import CreateAccountDialog from "@/src/features/account/create-account-dialog";

function OrganizationDropdown() {
  const {
    currentOrganization,
    setCurrentOrganization,
    organizations,
    currentAccount,
    setCurrentAccount,
  } = useAccountAtom();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { toggleNavMobileSidebar } = useNavMobileSidebarAtom();
  const t = useTranslations("shop");

  const [open, setOpen] = useState(false);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);

  useEffect(() => {
    setSelectedAccount(currentAccount);
  }, [currentAccount]);
  return (
    <Dialog
      open={showNewAccountDialog}
      onOpenChange={(v) => {
        setShowNewAccountDialog(v);
      }}
    >
      <DropdownMenu
        open={open}
        onOpenChange={(open) => {
          if (!currentAccount) {
            toast.warning("Please create an account first");
            return;
          }
          setOpen(open);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Card>
            {selectedAccount !== null ? (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
              >
                <Avatar className="aspect-square h-8 w-8 rounded-md">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${selectedAccount?.id}`}
                    alt={selectedAccount?.name}
                  />
                  <AvatarFallback>YB</AvatarFallback>
                </Avatar>
                <div className="flex w-full items-center justify-between gap-2 text-left text-sm leading-tight">
                  <div className="flex flex-col">
                    <span className="truncate font-semibold">
                      {selectedAccount?.name}
                    </span>
                    <span className="truncate text-xs">
                      {currentOrganization?.name ?? "Full name"}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-5 w-5" />
                </div>
              </SidebarMenuButton>
            ) : (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 rounded-full" />
                </div>
              </div>
            )}
          </Card>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          {organizations?.map((organization) => (
            <div key={organization.id}>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {organization.name}
              </DropdownMenuLabel>

              {organization.accounts.map((account) => (
                <DropdownMenuItem
                  key={account?.name}
                  onSelect={async () => {
                    setCurrentAccount(account);
                    setCurrentOrganization(organization);
                    await queryClient.refetchQueries({
                      queryKey: ["payment"],
                    });
                    setOpen(false);
                    toggleNavMobileSidebar();
                  }}
                  className="gap-2 p-2"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${account?.id}`}
                      alt={account?.name}
                    />
                    <AvatarFallback>YB</AvatarFallback>
                  </Avatar>
                  {account?.name}
                  {selectedAccount?.id === account.id && (
                    <Check className={cn("ml-auto h-4 w-4")} />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOpen(false);
              setShowNewAccountDialog(true);
            }}
            className="gap-2 p-2"
          >
            <div className="bg-background flex size-6 items-center justify-center rounded-md border">
              <Plus className="size-4" />
            </div>
            <div className="text-muted-foreground font-medium">
              {t("createShop")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateAccountDialog onClose={() => setShowNewAccountDialog(false)} />
    </Dialog>
  );
}

export default OrganizationDropdown;
