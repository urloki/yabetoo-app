import { Card, CardContent } from "@/components/ui/card";
import type { UseFormReturn } from "react-hook-form";

import type { z } from "zod";
import { cn } from "@/lib/utils";
import { paymentLinkSchema } from "@/src/shemas/payments-link/payment-link.schema";
import PaymentPanel from "./payment-panel";
import ProductPanel from "./product-panel";

function Preview({
  form,
  className,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
  className?: string;
}) {
  return (
    <div className={cn("h-[80vh] rounded-xl", className)}>
      <Card className="shadow-lg">
        <CardContent className="grid h-[80vh] grid-cols-2 p-0">
          <ProductPanel form={form} />
          <PaymentPanel form={form} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Preview;
