import { Address } from "viem";

export interface UnderlyingToken {
  symbol: string;
  address: Address;
  icon: string;
}

export interface Pool {
  id: number;
  symbol: string;
  network: string;
  power: number;
  underlyingTokens: UnderlyingToken[];
  poolAddress: Address;
  date: number;
  age: string;
  tvl: string;
  volume: {
    value: string;
    growth: string;
  };
  fee: {
    value: string;
    growth: string;
  };
}

export interface PotentiaPools {
  [key: string]: Pool;
}
