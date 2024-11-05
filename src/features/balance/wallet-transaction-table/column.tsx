"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableRowActions } from "./row-actions";
import { DataTableColumnHeader } from "@/components/table/table-column-header";
import { numberFormat } from "@/lib/utils";
import DateComponent from "@/components/date-component";
import {WalletTransaction} from "@/src/shemas/account/account-balance.schema";
import {objectTypes} from "@/src/config/constants";

export const walletTransactionColumns: ColumnDef<WalletTransaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "object",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const status = objectTypes.find(
        (status) => status.value === row.getValue("object"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[50px] items-center">
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amountCaptured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="text-sm font-bold">
            {numberFormat(
              row.getValue("amountCaptured"),
              row.original.currency.toUpperCase(),
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="text-sm font-bold">
            {numberFormat(
              row.getValue("amount"),
              row.original.currency.toUpperCase(),
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "amountFee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Frais" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="text-sm font-bold">
            {numberFormat(
              row.getValue("amountFee"),
              row.original.currency.toUpperCase(),
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "chargeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.getValue("chargeId")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[150px] items-center">
          <DateComponent date={row.getValue("createdAt")} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
