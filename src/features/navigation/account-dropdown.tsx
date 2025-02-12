"use client";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { useNavMobileSidebarAtom } from "@/src/atoms/nav.atom";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Account } from "@/src/shemas/account/account.schema";
import { getMerchantDetail } from "@/src/actions/entities/get-merchant.action";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import ChangePasswordDialog from "@/src/features/account/change-password-dialog";
import CreateAccountDialog from "@/src/features/account/create-account-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/src/providers/react-query-provider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

function AccountDropdown() {
  const { currentAccount, setCurrentAccount, accounts } = useAccountAtom();
  const { toggleNavMobileSidebar } = useNavMobileSidebarAtom();

  const { data: session } = useSession();
  const { data: merchant } = useQuery({
    queryKey: ["merchant"],
    queryFn: () => getMerchantDetail(),
  });

  const t = useTranslations("shop");

  const [open, setOpen] = useState(false);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    setSelectedAccount(currentAccount);
  }, [currentAccount, session, currentAccount]);

  return (
    <Dialog
      open={showNewAccountDialog}
      onOpenChange={(v) => {
        if (currentAccount && session?.user.accountConfirmed) {
          setShowNewAccountDialog(v);
        } else {
          toast.warning("Please complete information first.");
        }
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
                className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
                      {merchant?.businessCode ?? "Full name"}
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
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Boutiques
          </DropdownMenuLabel>
          {accounts?.map((account) => (
            <DropdownMenuItem
              key={account?.name}
              onSelect={async () => {
                setCurrentAccount(account);
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOpen(false);
              setShowNewAccountDialog(true);
            }}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus className="size-4" />
            </div>
            <div className="font-medium text-muted-foreground">
              {t("createShop")}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {session?.user.accountConfirmed ? (
        <CreateAccountDialog onClose={() => setShowNewAccountDialog(false)} />
      ) : (
        <ChangePasswordDialog />
      )}
    </Dialog>
  );
}

export default AccountDropdown;
