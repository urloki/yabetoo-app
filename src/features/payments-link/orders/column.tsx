"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableRowActions } from "./row-actions";
import { DataTableColumnHeader } from "@/components/table/table-column-header";

import { cn, getBadgeVariant, numberFormat } from "@/lib/utils";
import { getPaymentLinkOrderStatus } from "@/src/config/status.config";
import DateComponent from "@/components/date-component";
import {PaymentLinkOrder} from "@/src/shemas/payments-link/payment-link-order.schema";
import Badge from "@/components/ui/badge/Badge";

// download qr code by id

export const paymentLinkOrderColumns: ColumnDef<PaymentLinkOrder>[] = [
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
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {numberFormat(
            Number.parseFloat(row.getValue("total")),
            row.original.currency,
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payer" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          <Badge intent={getBadgeVariant(row.getValue("isPaid"))}>
            {row.getValue("isPaid")}
          </Badge>
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = getPaymentLinkOrderStatus.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="w-fit">
          <Badge
            className="flex items-center gap-2"
            intent={getBadgeVariant(row.getValue("status"))}
          >
            {status.icon && (
              <status.icon
                className={cn(
                  "h-4 w-4 text-muted-foreground",
                  status.value === "done" && "text-green-900",
                )}
              />
            )}
            <span className="truncate">{status.label}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nb de produits" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-fit items-center">
          <span>{(row.getValue("items") as Array<any>).length ?? 0}</span>
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
