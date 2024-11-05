"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableRowActions } from "./row-actions";
import { DataTableColumnHeader } from "@/components/table/table-column-header";
import type { z } from "zod";
import { format } from "@formkit/tempo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClipboardPaste, QrCode } from "lucide-react";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { describeProducts } from "@/lib/utils";
import {paymentLinkSchema} from "@/src/shemas/payments-link/payment-link.schema";
import  {QRCodeSVG} from "qrcode.react";
import Badge from "@/components/ui/badge/Badge"; // download qr code by id

// download qr code by id

export const paymentLinkColumns: ColumnDef<
  z.infer<typeof paymentLinkSchema>
>[] = [
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
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link url" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-3 ">
          <Badge className="w-fit" intent="gray">
            <span className="w-72 truncate font-bold">
              {row.getValue("url")}
            </span>
          </Badge>
          <Button
            variant="outline"
            size={"iconSm"}
            onClick={() => {
              navigator.clipboard.writeText(row.getValue("url")).then(() => {
                toast.success("Link copied to clipboard");
              });
            }}
          >
            <ClipboardPaste className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.getValue("title") ??
            describeProducts(row.original.products ?? [])}
        </span>
      );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.getValue("active") ? (
            <Badge intent="success"> Active</Badge>
          ) : (
            <Badge intent="danger"> Inactive</Badge>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {format(
              row.getValue("createdAt"),
              {
                date: "medium",
                time: "short",
              },
              "en",
            )}
          </span>
        </div>
      );
    },
  },
  {
    id: "qrCode",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <QrCode />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Qr code</DialogTitle>
              <DialogDescription>
                Scanner le code pour accéder au lien.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <QRCodeSVG
                size={256}
                id={`qr-code-${row.getValue("id")}`}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={row.getValue("url")}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  const qrCodeURL = document
                    .getElementById(`qr-code-${row.getValue("id")}`)
                    // @ts-ignore
                    ?.toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                  console.log(qrCodeURL);
                  const aEl = document.createElement("a");
                  aEl.href = qrCodeURL;
                  aEl.download = "QR_Code.png";
                  document.body.appendChild(aEl);
                  aEl.click();
                  document.body.removeChild(aEl);
                }}
                variant="outline"
              >
                Télécharger
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
