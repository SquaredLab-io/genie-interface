import { PoolInfo } from "@squaredlab-io/sdk/src";

export enum TableOptions {
  all = "all",
  my = "my",
  trxn = "trxn"
}

// dummy List of user's open positions
export const allPoolsData: PoolInfo[] = [
  {
    underlying: "WETH",
    power: 2,
    age: "Wed Jul 31 2024",
    tvl: "60110000", // in dollars
    vol: "52570000000000000000",
    fee: "430000000000000000",
    poolAddr: "0x4765d8b39e73e20943ff81e00b56b2b3aa5ffaa5",
    lastMonthTimestamp: "Mon Jul 01 2024",
    pool: "WETH / USDC",
    underlyingDecimals: 18
  }
];
