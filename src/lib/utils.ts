import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDollarUnits = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
};

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in Dollarsx
 */
export default function toDollarUnits(num: number, decimals: number): string {
  if (num >= 1000000) {
    return "$" + Number((num / 1000000).toFixed(decimals)).toLocaleString("en-US") + "M";
  } else if (num >= 1000 && num < 1000000) {
    return "$" + Number((num / 1000).toFixed(decimals)).toLocaleString("en-US") + "K";
  }
  return "$" + Number(num.toFixed(decimals)).toLocaleString("en-US");
}
