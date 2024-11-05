import { Card, CardContent } from "@/components/ui/card";
import ProductPanel from "@/components/payment-links/product-panel";
import type { UseFormReturn } from "react-hook-form";
import PaymentPanel from "@/components/payment-links/payment-panel";
import type { paymentLinkSchema } from "@/src/schemas/payment-link-schema";
import type { z } from "zod";
import { cn } from "@/lib/utils";

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
