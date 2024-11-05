"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableRowActions } from "./row-actions";
import { DataTableColumnHeader } from "@/components/table/table-column-header";
import type { z } from "zod";
import { intentLabels, intentStatuses, payouts } from "@/src/config/constants";
import { cn, getBadgeVariant, numberFormat } from "@/lib/utils";
import DateComponent from "@/components/date-component";
import Image from "next/image";
import {intentSchema} from "@/src/shemas/intent/intent.schema";
import Badge from "@/components/ui/badge/Badge";

export const intentColumns: ColumnDef<z.infer<typeof intentSchema>>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment ID" />
    ),
    cell: ({ row }) => {
      const label = intentLabels.find(
        (label) => label.value === row.original.label,
      );

      return (
        <div className="flex space-x-2">
          {label && <Badge intent="gray">{label.label}</Badge>}
          <span className="truncate font-medium">{row.getValue("id")}</span>
        </div>
      );
    },
  },
  /*{
      accessorKey: "charges",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment method" />
      ),
      cell: ({ row }) => {
        // find charge by id
        const charge = row.original.charges.find(
          (charge) => charge.id === row.original.chargeId,
        );
  
        if (!charge) {
          return (
            <div className="flex w-[120px] items-center">
              <span className="text-muted-foreground">--</span>
            </div>
          );
        }
  
        return (
          <div className="flex w-[120px] items-center">
            {charge.paymentMethod.type === "momo" && (
              <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{charge.paymentMethod.msisdn}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },*/
  {
    accessorKey: "charges",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      // find charge by id
      const charge = row.original.charges.find(
        (charge) => charge.id === row.original.chargeId,
      );

      if (!charge) {
        return (
          <div className="flex w-[120px] items-center">
            <span className="text-muted-foreground">--</span>
          </div>
        );
      }

      return (
        <div className="flex w-fit items-center gap-2">
          <Image
            src={`https://ui-avatars.com/api/?background=random&color=fff&rounded=true&name=${
              charge.paymentMethod?.customer?.firstName ?? "unknown"
            }`}
            alt="avatar"
            width={25}
            height={25}
          />
          <span>{charge.paymentMethod?.customer?.firstName ?? "--"}</span>
          <span className="truncate font-bold">
            {charge.paymentMethod?.customer?.lastName ?? "--"}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
        <div className="w-[120px]">
          <Badge
            className="flex items-center gap-2 font-bold"
            intent={getBadgeVariant(status.value)}
          >
            {status.icon && (
              <status.icon
                className={cn(
                  "h-4 w-4 text-muted-foreground",
                  status.value === "succeeded" && "text-green-900",
                )}
              />
            )}
            <span>{status.label}</span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "payoutStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payout" />
    ),
    cell: ({ row }) => {
      const priority = payouts.find(
        (priority) => priority.value === row.getValue("payoutStatus"),
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex w-[170px] items-center">
          <Badge
            className="flex items-center gap-2"
            intent={getBadgeVariant(priority.value)}
          >
            {priority.icon && (
              <priority.icon
                className={cn(
                  "mr-2 h-4 w-4 text-muted-foreground",
                  priority.color,
                )}
              />
            )}
            <span>{priority.label}</span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
