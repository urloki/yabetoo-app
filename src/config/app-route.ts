import {
  RiExchange2Line,
  RiHome2Line,
  RiShoppingBag2Line,
  RiUser4Line,
} from "@remixicon/react";
import { History, LifeBuoy, Send, Star, Wallet } from "lucide-react";

export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    //overview: "/overview",
    balance: "/balance",
    transactions: "/payments",
    customers: "/customers",
    productCatalog: "/products",
  },
  externalLink: {
    blocks: "https://blocks.tremor.so/templates#dashboard",
  },
};

export const navigation = [
  //{ name: "overview", href: siteConfig.baseLinks.overview, icon: RiHome2Line },
  { name: "balance", href: siteConfig.baseLinks.balance, icon: RiHome2Line },
  {
    name: "transactions",
    href: siteConfig.baseLinks.transactions,
    icon: RiExchange2Line,
  },
  {
    name: "customers",
    href: siteConfig.baseLinks.customers,
    icon: RiUser4Line,
  },
  {
    name: "productsCatalog",
    href: siteConfig.baseLinks.productCatalog,
    icon: RiShoppingBag2Line,
  },
  /*{
    name: "paymentLinks",
    href: "/payment-links",
    icon: RiLinksLine,
  },*/
] as const;

export const payments = [
  {
    name: "paymentLinks",
    href: "/payment-links",
    icon: RiExchange2Line,
  },
  {
    name: "orders",
    href: "/payment-links/orders",
    icon: RiUser4Line,
  },
] as const;

export const productsNavigation = [
  {
    title: "Paiements",
    icon: Wallet,
    isActive: false,
    items: [
      {
        title: "paymentLinks",
        url: "/payment-links",
        icon: History,
        description: "View your recent prompts",
      },
      {
        title: "orders",
        url: "/payment-links/orders",
        icon: Star,
        description: "View your recent prompts",
      },
      /*{
        title: "Factures (bientôt disponibles)",
        url: "#",
        icon: Star,
        description: "Browse your starred prompts",
      },*/
    ],
  },
];

export const supportNavigation = [
  {
    title: "Support",
    url: "https://docs.yabetoopay.com",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
];

export type siteConfig = typeof siteConfig;
