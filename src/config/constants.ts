import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { RiCheckLine, RiCloseLine, RiTimeLine } from "@remixicon/react";

export const intentLabels = [
  {
    value: "payment_intent",
    label: "payment",
  },
  {
    value: "payment_link",
    label: "link",
  },
  {
    value: "invoice",
    label: "invoice",
  },
];

export const paymentLinkStatuses = [
  {
    value: true,
    label: "Active",
    icon: CheckCircledIcon,
  },
  {
    value: false,
    label: "Inactive",
    icon: CrossCircledIcon,
  },
];

export const orderStatuses = [
  {
    value: "pending",
    label: "Pending",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "succeeded",
    label: "Succeeded",
    icon: CheckCircledIcon,
  },
  {
    value: "failed",
    label: "Failed",
    icon: CrossCircledIcon,
  },
];

export const payouts = [
  {
    value: "requires_capture",
    label: "Required Capture",
    icon: StopwatchIcon,
    color: "text-orange-500",
  },
  {
    value: "requires_action",
    label: "Required Action",
    icon: StopwatchIcon,
    color: "text-yellow-500",
  },
  {
    value: "balance_credited",
    label: "credited",
    icon: CheckCircledIcon,
    color: "text-green-500",
  },
  {
    value: "failed",
    label: "Failed",
    icon: CrossCircledIcon,
    color: "text-red-500",
  },
];

export const intentStatuses = [
  {
    value: "succeeded",
    label: "Réussi",
    icon: RiCheckLine,
  },
  {
    value: "requires_confirmation",
    label: "Incomplete",
    icon: RiTimeLine,
  },
  {
    value: "failed",
    label: "Échoué",
    icon: RiCloseLine,
    color: "text-red-500",
  },
  {
    value: "expired",
    label: "Expiré",
    icon: RiCloseLine,
  },
  {
    value: "processing",
    label: "En cours de traitement",
    icon: RiTimeLine,
  },
  {
    value: "canceled",
    label: "Annulé",
    icon: RiCloseLine,
  },
];
export const productCategory = [
  {
    value: "1",
    label: "Ebook",
  },
  {
    value: "2",
    label: "Digital goods or services (excluding ebooks)",
  },
  {
    value: "3",
    label: "Software as a service (SaaS)",
  },
  {
    value: "4",
    label: "Clothing",
  },
  {
    value: "5",
    label: "Other",
  },
];

export const productStatus = [
  {
    value: "draft",
    label: "Draft",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "published",
    label: "Published",
    icon: CheckCircledIcon,
  },
  {
    value: "archived",
    label: "Archived",
    icon: CrossCircledIcon,
  },
];

export const objectTypes = [
  {
    value: "wallet_transaction",
    label: "Paiement",
    icon: CheckCircledIcon,
  },
  {
    value: "withdraw",
    label: "Retrait",
    icon: CheckCircledIcon,
  },
  {
    value: "transfer",
    label: "Transfert",
    icon: CheckCircledIcon,
  },
  {
    value: "cash_out",
    label: "Cash out",
    icon: CheckCircledIcon,
  },
];
