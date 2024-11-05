"use client";
import type { PaymentLink } from "@/src/schemas/payment-link/schema";
import { useAccountAtom } from "@/src/atoms/account-atom";
import { numberFormat } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { paymentLinkSchema } from "@/src/schemas/payment-link-schema";
import { zodResolver } from "@hookform/resolvers/zod";

function Overview({ link }: { link: PaymentLink | undefined }) {
  const { currentAccount } = useAccountAtom();

  const form = useForm<z.infer<typeof paymentLinkSchema>>({
    resolver: zodResolver(paymentLinkSchema),
    defaultValues: {
      type: link?.type?.toString() ?? "1",
      products: link?.products,
      callToAction: link?.callToAction?.toString() ?? "1",
      collectAddress: link?.collectAddress ?? false,
      isLimited: link?.isLimited ?? false,
      showCustomMessage: link?.showCustomMessage ?? false,
    },
  });

  return (
    <div className="pt-5">
      <div className="grid grid-cols-2 gap-10">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          {link?.type === 1 && (
            <div className="grid  grid-cols-3 gap-3">
              {link?.allProducts?.map((product) => (
                <Card key={product.id} className="mt-5 shadow-none">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>
                      {numberFormat(
                        Number.parseInt(product.price),
                        currentAccount?.country.currency.code,
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <span className="text-sm">{product.description}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-1/2 pt-10">
        <h1 className="text-xl font-bold">Details</h1>
        <Separator className="mt-5" />
      </div>
    </div>
  );
}

export default Overview;
