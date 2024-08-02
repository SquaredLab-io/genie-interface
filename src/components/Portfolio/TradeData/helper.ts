import { Tx } from "@lib/types/portfolio";
import { OpenPositionInfo, PositionTab } from "@squaredlab-io/sdk/src";

/**
 * TODO: Remove as deprecated
 * Get your latest Trade History aggregated into Open Long/Short Positions.
 */
export function getLatestTransactions(transactions?: Tx[]): Tx[] {
  if (!transactions) return new Array<Tx>();

  let latestLongTx: Tx | null = null;
  let latestShortTx: Tx | null = null;

  for (const tx of transactions) {
    if (
      tx.action === "Open Long Position" &&
      (!latestLongTx || Number(tx.dateTime) > Number(latestLongTx.dateTime))
    ) {
      latestLongTx = tx;
    } else if (
      tx.action === "Open Short Position" &&
      (!latestShortTx || Number(tx.dateTime) > Number(latestShortTx.dateTime))
    ) {
      latestShortTx = tx;
    }
  }

  return [latestLongTx, latestShortTx].filter((tx) => tx !== null) as Tx[];
}

export function getOpenTransactions(openOrders?: PositionTab): OpenPositionInfo[] {
  if (!openOrders) return new Array<OpenPositionInfo>();
  const data = [openOrders.longPositionTab, openOrders.shortPositionTab]
  console.log('openorders in tradedata', data);
  return data;
}

export function getClosedTransactions(transactions?: Tx[]): Tx[] {
  if (!transactions) return new Array<Tx>();
  return transactions.filter(
    (tx) =>
      (tx.action === "Close Long Position" || tx.action === "Close Short Position") &&
      tx !== null
  ) as Tx[];
}

export function getDateTime(blockTimestamp: string) {
  const dateObj = new Date(parseInt(blockTimestamp) * 1000);

  // Get date components
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Months are zero-indexed, so add 1
  const year = dateObj.getFullYear();

  // Get time components
  const hours = dateObj.getHours().toString().padStart(2, "0"); // Ensure two digits
  const minutes = dateObj.getMinutes().toString().padStart(2, "0"); // Ensure two digits

  // Format date and time strings
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return {
    date: formattedDate,
    time: formattedTime
  };
}
