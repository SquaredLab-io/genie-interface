import { WagmiFetchBalanceResult } from "@lib/types/common";
import { formatNumber } from "./formatting";

/**
 * Account balance formatted with Currency/Token Symbol
 */
export const getAccountBalance = (
  data?: WagmiFetchBalanceResult,
  isLoading?: boolean
): string => {
  if (!data && isLoading) return "...";
  return `${formatNumber(parseFloat(data?.formatted ?? "0"))} ${data?.symbol}`;
};
