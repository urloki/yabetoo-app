import { RiCheckLine, RiTimeLine } from "@remixicon/react";

export const getPaymentLinkOrderStatus = [
  {
    value: "pending",
    label: "En attente de traitement",
    icon: RiTimeLine,
  },
  {
    value: "done",
    label: "Traitée",
    icon: RiCheckLine,
  },
];
