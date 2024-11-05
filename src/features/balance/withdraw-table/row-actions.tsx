"use client";

import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import type {Row} from "@tanstack/react-table";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WithdrawShowBtn from "@/src/features/balance/withdraw/withdraw-show-btn";
import {Withdraw} from "@/src/shemas/account/account-balance.schema";


interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4"/>
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="cursor-pointer">
                    <WithdrawShowBtn withdraw={row.original as Withdraw}/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
