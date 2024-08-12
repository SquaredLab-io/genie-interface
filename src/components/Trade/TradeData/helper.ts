import {
  OpenPositionInfo,
  PositionTab,
  Tx
} from "@squaredlab-io/sdk/src/interfaces/index.interface";

export function getOpenTransactions(openOrders?: PositionTab): OpenPositionInfo[] {
  if (!openOrders) return new Array<OpenPositionInfo>();
  const longPos = openOrders.longPositionTab;
  const shortPos = openOrders.shortPositionTab;
  const data =
    longPos && shortPos
      ? [longPos, shortPos]
      : longPos && !shortPos
        ? [longPos]
        : !longPos && shortPos
          ? [shortPos]
          : [];
  // console.log("getOpenTransactions", data);
  return data;
}

export function getClosedTransactions(transactions?: Tx[]): Tx[] {
  // console.log("closed transactions", transactions);
  if (!transactions) return new Array<Tx>();
  return transactions;
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
