import { WagmiFetchBalanceResult } from "@lib/types/common";
import toUnits from "./formatting";

/**
 * Account balance formatted with Currency/Token Symbol
 */
export const getAccountBalance = (
  data?: WagmiFetchBalanceResult,
  isLoading?: boolean
): string => {
  if (!data) return "0";
  else if (isLoading) return "...";
  return `${toUnits(parseFloat(data?.formatted), 3)} ${data?.symbol}`;
};
