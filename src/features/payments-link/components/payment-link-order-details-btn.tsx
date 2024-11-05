"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { RiMoneyDollarBoxLine } from "@remixicon/react";
import { cn, getBadgeVariant, numberFormat } from "@/lib/utils";
import DateComponent from "@/components/date-component";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { queryClient } from "@/src/providers/react-query-provider";
import { Icons } from "@/components/icons";
import {PaymentLinkOrder} from "@/src/shemas/payments-link/payment-link-order.schema";
import {intentStatuses} from "@/src/config/constants";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {editPaymentLinkOrderStatus} from "@/src/actions/payment-links/order/edit-payment-link-order-status.action";
import Badge from "@/components/ui/badge/Badge";
import {getPaymentLinkOrderStatus} from "@/src/config/status.config";
import {getIntentByIdAction} from "@/src/actions/intent/get-intent-by-id.action";

const FormSchema = z.object({
  status: z.string({
    required_error: "Please select an email to display.",
  }),
});

function PaymentLinkOrderDetailsBtn({ order }: { order: PaymentLinkOrder }) {
  console.log(order);
  const status = getPaymentLinkOrderStatus.find(
    (status) => status.value === order.status,
  );
  const paymentStatus = intentStatuses.find(
    (status) => status.value === order.isPaid,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: order.status,
    },
  });

  const { currentAccount } = useAccountAtom();
  const { data: intent } = useQuery({
    queryKey: [
      "show-intent",
      order.intentId,
      currentAccount?.id,
      currentAccount?.isLive,
    ],
    queryFn: ({ queryKey }) =>
      getIntentByIdAction(
        queryKey[2] as string,
        queryKey[1] as string,
        queryKey[3] as boolean,
      ),
  });

  const customer = intent?.charges.find(
    (charge) => charge.id === intent?.chargeId,
  )?.paymentMethod.customer;

  const { mutate, isPending } = useMutation({
    mutationFn: editPaymentLinkOrderStatus,
    onSuccess: async (response) => {
      toast.success("Modification du statut de la commande effectuée");
      await queryClient.invalidateQueries({
        queryKey: ["payment-links-orders"],
      });
      console.log(response);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error.message);
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({
      accountId: currentAccount?.id as string,
      orderId: order.id,
      status: data.status,
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span
          className="cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
        >
          Voir les détails
        </span>
      </SheetTrigger>
      <SheetContent
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader>
          <SheetTitle>Détails de la commande</SheetTitle>
        </SheetHeader>
        <div className="mt-10">
          <div className="flex items-center gap-4">
            <Avatar className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground text-white">
              <RiMoneyDollarBoxLine />
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                Montant de la commande
              </p>
              <p className="text-xl font-bold">
                {numberFormat(Number.parseFloat(order.total), order.currency)}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="mb-5 font-bold">Détails du retrait</p>
            <div className="my-2 flex items-center justify-between">
              <p>Paiement</p>
              <p className="items-end text-sm text-muted-foreground">
                <Badge
                  className="flex items-center gap-2"
                  intent={getBadgeVariant(order.isPaid)}
                >
                  {paymentStatus?.icon && (
                    <paymentStatus.icon
                      className={cn(
                        "h-4 w-4 text-muted-foreground",
                        paymentStatus.value === "succeeded" && "text-green-900",
                      )}
                    />
                  )}
                  <span className="truncate">{paymentStatus?.label}</span>
                </Badge>
              </p>
            </div>
            <div className="my-2 flex items-center justify-between">
              <p>État</p>
              <p className="items-end text-sm text-muted-foreground">
                <Badge
                  className="flex items-center gap-2"
                  intent={getBadgeVariant(order.status)}
                >
                  {status?.icon && (
                    <status.icon
                      className={cn(
                        "h-4 w-4 text-muted-foreground",
                        status.value === "succeeded" && "text-green-900",
                      )}
                    />
                  )}
                  <span className="truncate">{status?.label}</span>
                </Badge>
              </p>
            </div>
            <div className="my-2 flex items-center justify-between">
              <p>Date de la demande</p>
              <p className="items-end text-sm text-muted-foreground">
                <DateComponent date={order.createdAt} />
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="mb-5 font-bold">Client</p>
            <div className="my-2 flex items-center justify-between">
              <p>Nom</p>
              <p className="items-end text-sm text-muted-foreground">
                {customer?.firstName} {customer?.lastName}
              </p>
            </div>
            <div className="my-2 flex items-center justify-between">
              <p>N° de téléphone</p>
              <p className="items-end text-sm text-muted-foreground">
                {intent?.charges.find(
                  (charge) => charge.id === intent?.chargeId,
                )?.paymentMethod.msisdn ?? "N/A"}
              </p>
            </div>
            <div className="my-2 flex items-center justify-between">
              <p>Email</p>
              <p className="items-end text-sm text-muted-foreground">
                {customer?.email ?? "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="mb-5  font-bold">Éléments de la commande</p>
            <div className="">
              <div className="flex flex-col gap-5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-md border p-5"
                  >
                    <span className="font-boldd text-xl">
                      {item.productName}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Prix :{" "}
                        {numberFormat(
                          Number.parseFloat(item.price),
                          order.currency,
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Quantité : {item.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-bold">
                        Variante : {item.variant?.name}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-bold">Options</span>
                      <div className="mt-2 flex flex-col gap-2">
                        {item.options ? (
                          <ul>
                            {Object.entries(item.options).map(
                              ([key, value]) => (
                                <li key={key}>
                                  {key} : {value as string}
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <span>Aucune</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <p className="mb-5 font-bold">Actions</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">
                            En attente de traitement
                          </SelectItem>
                          <SelectItem value="done">Traitée</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Changez le statut de la commande notifier le client que
                        la commande a été traitée.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  Enregistrer{" "}
                  {isPending && (
                    <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PaymentLinkOrderDetailsBtn;
