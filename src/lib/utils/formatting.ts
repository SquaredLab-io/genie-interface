import BigNumber from "bignumber.js";
import { formatUnits } from "viem";

/**
 * Gives expontential values if number is lesser than 1e-3 or greater than -1e-3
 * Rest if gives in dollar expressions
 **/
export function formatNumber(
  num: number,
  isDollar: boolean = false,
  decimals: 0 | 1 | 2 | 3 = 2
) {
  if (num === 0) return isDollar ? "$0" : "0";
  // number belongs to (-0.001, 0.001)
  else if (num > -1e-2 && num < 1e-2) {
    return isDollar ? `$${num.toExponential(0)}` : num.toExponential(0);
  }
  // Otherwise, format to exactly three decimal places
  return isDollar ? toDollarUnits(num, decimals) : toUnits(num, decimals);
}

export function formatDollarUnits(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function formatLimit(amount: string | undefined, limit: number) {
  const _amount = parseFloat(amount ?? "0");
  const isUnderLimit = _amount >= limit || _amount <= limit * -1;
  return {
    sign: _amount >= limit,
    value: isUnderLimit ? _amount : 0
  };
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in Dollarsx
 */
export function toDollarUnits(num: number | undefined, decimals: 0 | 1 | 2 | 3): string {
  if (!num || isNaN(num)) return "$0";

  const absNum = Math.abs(num);
  const isPositive = num > 0;

  if (absNum >= 1e9) {
    return (
      `${!isPositive ? "-" : ""}$` +
      Number((absNum / 1e9).toFixed(decimals)).toLocaleString("en-US") +
      "B"
    );
  } else if (absNum >= 1e6) {
    return (
      `${!isPositive ? "-" : ""}$` +
      Number((absNum / 1e6).toFixed(decimals)).toLocaleString("en-US") +
      "M"
    );
  }
  return (
    `${!isPositive ? "-" : ""}$` +
    Number(absNum.toFixed(decimals)).toLocaleString("en-US")
  );
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in shortned Units
 */
export default function toUnits(
  num: number | undefined,
  decimals: 0 | 1 | 2 | 3
): string {
  if (!num || isNaN(num)) return "0";
  else if (num >= 1e9) {
    return Number((num / 1e9).toFixed(decimals)).toLocaleString("en-US") + "B";
  } else if (num >= 1e6) {
    return Number((num / 1e6).toFixed(decimals)).toLocaleString("en-US") + "M";
  }
  return Number(num.toFixed(decimals)).toLocaleString("en-US");
}

export function shortenHash(hash: string | undefined): string {
  if (!hash) return "N/A";
  return hash.slice(0, 8) + "..." + hash.slice(-6);
}

export function getDollarQuote(
  baseAmount: string,
  oraclePrice: string,
  decimals: number
): string {
  return formatNumber(
    getDecimalAdjusted(baseAmount, decimals) *
      formatOraclePrice(BigInt(oraclePrice), decimals),
    true
  );
}

export function getDecimalDeadjusted(
  value: string | undefined,
  decimals: number | undefined
): string {
  if (!value) return "0";
  return new BigNumber(value).multipliedBy(10 ** (decimals ?? 18)).toFixed(0);
}

export function getDecimalAdjusted(value: string | undefined, decimals: number | undefined): number {
  if (!value) return 0;
  return parseFloat(value) / 10 ** (decimals ?? 0);
}

export function _getDecimalAdjusted(
  value: string | undefined,
  decimals: number | undefined
): string {
  if (!value) return "0";
  return formatUnits(BigInt(value), decimals ?? 18);
}

// eg. used in Trade Flow
export function formatOraclePrice(
  price: bigint | undefined,
  tokenDecimals: number | undefined
): number {
  return parseInt((price ?? 0).toString()) / 10 ** (tokenDecimals ?? 18);
}

export function formatTimestamp(timestamp: string): {
  date: string;
  time: string;
} {
  const dateObj = new Date(parseInt(timestamp) * 1000);

  // Format date
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = dateObj.getFullYear();

  const date = `${day}.${month}.${year}`;

  // Format time
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const time = `${hours}:${minutes}:${seconds}`;

  return { date, time };
}

/**
 * To deprecate
 */
export function getCorrectFormattedValue(value: number, inDollars = false): string {
  if (value < 0.00001) return inDollars ? "< $0.00001" : "< 0.00001";
  else return inDollars ? `$${value.toFixed(5)}` : value.toFixed(5);
}
