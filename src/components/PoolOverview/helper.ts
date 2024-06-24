import { allPoolsData } from "@components/Pools/PoolsData/helper";

export const poolInfo = allPoolsData[0];

export enum GraphOptions {
  volume = "volume",
  tvl = "tvl",
  crossbook = "crossbook",
  counterpart = "counterpart"
}

export enum TradeOptions {
  add = "add",
  remove = "remove"
}
