import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiAddLine, RiLinksLine } from "@remixicon/react";
import Link from "next/link";

export function ShortcutButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="hidden items-center rounded-full md:flex">
          <RiAddLine className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10} className="mr-10 w-56">
        <DropdownMenuLabel>Paiements en ligne</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/payment-links/new">
            <DropdownMenuItem>
              <RiLinksLine className="mr-2 h-4 w-4" />
              <span>Lien de paiement</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/products/create">
            <DropdownMenuItem>
              <Package className="mr-2 h-4 w-4" />
              <span>Produit</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
