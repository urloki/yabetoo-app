import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import countryData from "@/src/config/country-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberFormat(
  number: number,
  currency = "EUR",
  showCurrency = true,
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    currencyDisplay: showCurrency ? "symbol" : undefined,
  }).format(number);
}

export const getOperator = (code: string) => {
  switch (code) {
    case "cg":
      return countryData.operator.congo;
    default:
      return [];
  }
};

export const findCountry = (code: string) => {
  return countryData.country.find((c) => c.code === code);
};

export const findCurrencyByCountry = (code: string) => {
  return countryData.country.find((c) => c.code === code)?.currency;
};

export const getBadgeVariant = (status: string) => {
  switch (status) {
    case "succeeded":
      return "success";
    case "failed":
      return "danger";
    case "incomplete":
      return "gray";
    case "requires_confirmation":
      return "gray";
    case "requires_action":
      return "gray";
    case "requires_capture":
      return "gray";
    case "balance_credited":
      return "primary";
    case "pending":
      return "warning";
    case "canceled":
      return "danger";
    default:
      return "gray";
  }
};

export function describeProducts(products: Array<any>) {
  if (products.length === 0) {
    return "No products";
  }

  const firstProduct = products[0];
  const totalProducts = products.length;

  if (totalProducts === 1) {
    return firstProduct.productName;
  }
  return `${firstProduct.productName} and ${totalProducts - 1} more`;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export const cleanOptionsValues = (
  options: { values: string[]; name: string }[],
): { values: string[]; name: string }[] => {
  return options
    .map((option) => ({
      ...option,
      values: option.values.filter((value: string) => value.trim() !== ""),
    }))
    .filter((option) => option.values.length > 0);
};

