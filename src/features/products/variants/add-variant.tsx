"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategory } from "@/src/config/constants";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import {ProductVariant, variantSchema} from "@/src/shemas/product/product.schema";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {addProductVariant} from "@/src/actions/product/add-product-variant";

function AddVariant({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const form = useForm<ProductVariant>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      description: "",
      productId: productId,
    },
    mode: "onBlur",
  });
  const { currentAccount } = useAccountAtom();

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: ProductVariant) {
    try {
      startTransition(() => {
        addProductVariant({
          payload: values,
          accountId: currentAccount?.id as string,
        }).then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success("Product variant created successfully");
            onClose();
          }
        });
      });
    } catch (e) {
      console.log(e);
      toast.error("An error occurred while creating product");
    }
  }

  return (
    <Form {...form}>
      <form
        key={"add-variant"}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("submitting", form.formState);
          form.handleSubmit(onSubmit)();
          /* if (form.formState.isValid) {
            console.log("submitting", form.getValues());
            onSubmit(form.getValues());
          }*/
        }}
      >
        <div className="grid gap-4 px-5  pt-4">
          <Card className="border-none">
            <CardHeader className="px-0">
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Product details and description</CardDescription>
            </CardHeader>
            <CardContent className="px-0 ">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          <div className="flex items-center justify-between ">
                            <p>Give your product a short and clear name.</p>
                            <span
                              className={cn(
                                form.watch("name")?.length > 60 &&
                                  "text-red-500",
                              )}
                            >
                              {form.watch("name")?.length} / 60
                            </span>
                          </div>
                          50-60 characters is the recommended length for search
                          engines.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          <div className="flex items-center justify-between">
                            <p>
                              Give your product a short and clear description.
                            </p>
                          </div>
                          120-160 characters is the recommended length for
                          search engines.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none">
            <CardHeader className="px-0">
              <CardTitle>Product Category</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productCategory.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the category of your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none">
            <CardHeader className="px-0">
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the price for your product</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type={"number"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-4 px-5 pb-5">
          <SheetClose>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" disabled={isPending}>
            Save Variant
            {isPending && (
              <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddVariant;
