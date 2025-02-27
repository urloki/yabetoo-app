import type { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { z } from "zod";
import { paymentLinkSchema } from "@/src/shemas/payments-link/payment-link.schema";

const getCta = (cta: string) => {
  switch (cta) {
    case "1":
      return "Pay";
    case "2":
      return "Book";
    case "3":
      return "Donate";
    default:
      return "Pay";
  }
};

function PaymentPanel({
  form,
}: {
  form: UseFormReturn<z.infer<typeof paymentLinkSchema>>;
}) {
  return (
    <div className="flex text-sm">
      <Separator orientation={"vertical"} />
      <div className="mx-auto my-auto grid">
        <Card className="max-w-96 border-none shadow-none">
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Email</Label>
                <Input disabled id="name" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">First name</Label>
                  <Input disabled id="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Last name</Label>
                  <Input disabled id="name" />
                </div>
              </div>
            </div>
            {form.watch("collectAddress") && (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Billing address</h4>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Address</Label>
                      <Input disabled id="name" />
                    </div>
                  </div>
                </div>
              </>
            )}
            <Separator className="my-4" />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Payment method</h4>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="month">Country</Label>
                    <Select disabled defaultValue="1">
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Congo</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Operator</Label>
                    <Select disabled defaultValue={"1"}>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">MTN Congo</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Phone number</Label>
                  <Input disabled id="name" />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full">
              {getCta(form.watch("callToAction"))}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default PaymentPanel;
