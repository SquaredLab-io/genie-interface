import { Address } from "viem";

export type Token = {
  symbol: string;
  imgSrc: string;
  address: Address;
};

export type Amount = {
  value: string;
  growth: string;
};

export type PoolInfo = {
  tvl: string; // 10044417800435319492232n
  age: string; // "Sun Jun 1 2024"
  vol: string; // "20000000000000000000"
  fee: string; // "0"
  lastMonthTimestamp: string; // "Sat Jun 01 2024"
  poolAddr: string; // "0x73d705ff0fc884315a61afd3fde3646fb0a949e6"
  underlying: string; // "WBTC"
  pool: string; // "WBTC / USDC"
  power: number; // 3
  underlyingDecimals: number; // 18
};

export type PoolType = {
  id: number;
  underlyingAssets: Token[];
  network: string;
  power: number;
  age: string;
  tvl: string;
  volume: Amount;
  fee: Amount;
  protocol: string;
};

export type UserPoolType = {
  id: number;
  assets: Token[];
  network: string;
  power: number;
  protocol: string;
  totalAmount: Amount;
};

export type TxnPoolType = {
  id: number;
  assets: Token[];
  network: string;
  power: number;
  protocol: string;
  txnHash: string;
  amount: string;
  feesEarned: string;
  total: string;
  totalDollar: string;
};
