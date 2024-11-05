"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UseFormReturn } from "react-hook-form";
import {Product} from "@/src/shemas/product/product.schema";

export default function ProductImage({
  form,
}: {
  form: UseFormReturn<Product>;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Images</CardTitle>
        <CardDescription>
          Vos images s&lsquo;afficheront sur votre page produit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Image
            alt="Product image"
            className="aspect-square w-full rounded-md object-cover"
            height="300"
            src={form.watch("documents")?.[0]?.url ?? "/placeholder.svg"}
            width="300"
          />
          <div className="grid grid-cols-3 gap-2">
            {form
              .watch("documents")
              ?.slice(1)
              .map((document) => (
                <div key={document.key} className="rounded-md border p-2">
                  <Image
                    alt="Product image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="84"
                    src={document.url ?? "/placeholder.svg"}
                    width="84"
                  />
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
