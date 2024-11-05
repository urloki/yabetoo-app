"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/table/table-column-header";
import { intentStatuses, objectTypes } from "@/src/config/constants";
import { cn, getBadgeVariant, numberFormat } from "@/lib/utils";
import DateComponent from "@/components/date-component";
import {DataTableRowActions} from "./row-actions";
import {Withdraw} from "@/src/shemas/account/account-balance.schema";
import Badge from "@/components/ui/badge/Badge";

export const withdrawColumns: ColumnDef<Withdraw>[] = [
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = intentStatuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-fit items-center">
          <Badge
            intent={getBadgeVariant(status.value)}
            className="flex items-center gap-1 text-xs font-bold"
          >
            <span className="truncate">{status.label}</span>
            {status.icon && (
              <status.icon
                className={cn(
                  "h-4 w-4 text-muted-foreground",
                  status.value === "succeeded" && "text-green-900",
                  status.value === "failed" && "text-red-900",
                  status.value === "canceled" && "text-red-900",
                )}
              />
            )}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "shouldExecutedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doit être exécuté" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[150px] items-center">
          {row.getValue("shouldExecutedAt") ? (
            <DateComponent
              showTime={false}
              date={row.getValue("shouldExecutedAt")}
            />
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "executedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exécuté" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[150px] items-center">
          {row.getValue("executedAt") ? (
            <DateComponent date={row.getValue("executedAt")} />
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de demande" />
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
