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
export function toDollarUnits(num: number, decimals: number): string {
  if (num >= 1000000) {
    return "$" + Number((num / 1000000).toFixed(decimals)).toLocaleString("en-US") + "M";
  } else if (num >= 1000 && num < 1000000) {
    return "$" + Number((num / 1000).toFixed(decimals)).toLocaleString("en-US") + "K";
  }
  return "$" + Number(num.toFixed(decimals)).toLocaleString("en-US");
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in shortned Units
 */
export default function toUnits(num: number, decimals: 0 | 1 | 2 | 3): string {
  if (!num) return "0";
  else if (num >= 1000000) {
    return Number((num / 1000000).toFixed(decimals)).toLocaleString("en-US") + "M";
  }
  // else if (num >= 1000 && num < 1000000) {
  //   return Number((num / 1000).toFixed(decimals)).toLocaleString("en-US") + "K";
  // }
  return Number(num.toFixed(decimals)).toLocaleString("en-US");
}

export function shortenHash(hash: string | undefined): string {
  if (!hash) return "N/A";
  return hash.slice(0, 8) + "..." + hash.slice(-6);
}

export function getDecimalAdjusted(
  value: string | undefined,
  decimals: number | undefined
): number {
  if (!value) return 0;
  return parseFloat(value ?? "0") / 10 ** (decimals ?? 18);
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
