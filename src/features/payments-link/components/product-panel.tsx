"use client";
import { useAccountAtom } from "@/src/atoms/account-atom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { numberFormat } from "@/lib/utils";
import type { paymentLinkSchema } from "@/src/schemas/payment-link-schema";
import { Store } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

function ProductPanel({
  form,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
}) {
  const products = form.watch("products");
  const { currentAccount } = useAccountAtom();

  const getCartTotal = () => {
    let total = 0;
    for (const product of products ?? []) {
      total += product.price * product.quantity;
    }
    return total;
  };

  return (
    <div className="mt-28 flex flex-col justify-between px-10">
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-full p-2 shadow-md">
            <Store className="h-5 w-5" />
          </div>
          <span className="truncate">{currentAccount?.name}</span>
          <Badge variant={"destructive"}>TEST</Badge>
        </div>
        {form.watch("type") === "1" ? (
          <>
            <div className="mb-10">
              <p className="text-sm text-gray-400">Pay Yabetoo</p>
              <span className="text-3xl font-bold">
                {numberFormat(
                  getCartTotal(),
                  currentAccount?.country?.currency?.code,
                )}
              </span>
            </div>
            <div className="flex flex-col gap-5">
              {products?.map((product) => (
                <div key={product.productId} className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="">{product.productName}</span>
                    <span className="">
                      {numberFormat(
                        product.price * product.quantity,
                        currentAccount?.country?.currency?.code,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 ">
                      Qty {product.quantity}
                    </span>
                    <span className="text-gray-400">
                      {numberFormat(
                        product.price,
                        currentAccount?.country?.currency?.code,
                      )}{" "}
                      each
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">
                {form.watch("title") == null
                  ? "Title"
                  : form.getValues("title")}
              </Label>
              <Input
                disabled
                id="email"
                placeholder={numberFormat(
                  0,
                  currentAccount?.country?.currency?.code,
                )}
              />
            </div>
          </>
        )}
      </div>

      <div className="pb-36 text-gray-400">
        Powered by <span className="font-bold text-primary">Yabetoo</span>
      </div>
    </div>
  );
}

export default ProductPanel;
