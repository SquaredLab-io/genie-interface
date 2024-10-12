import { PoolMapping } from "@lib/hooks/usePools";
import { PoolInfo } from "@squaredlab-io/sdk";

export const SUPPORTED_POOLS = [
  "0x050Ac74c2Fe33D932ef30f7c481e8d9d029568D4", // WETH^2
  "0x9cdAA94733a682013Ff8AfD72BA59FB63619C98d" // WETH^8
];

export const getSupportedPools = (pools: PoolInfo[] | undefined) => {
  if (!pools || pools.length === 0) return pools;
  return pools.filter((pool) => SUPPORTED_POOLS.includes(pool.poolAddr));
};

export function createPoolMapping(
  pools: PoolInfo[] | undefined
): Record<string, PoolMapping> | undefined {
  if (!pools) return undefined;
  return pools.reduce(
    (mapping, pool) => {
      mapping[pool.poolAddr] = {
        power: pool.power,
        underlying: pool.underlying,
        decimals: pool.underlyingDecimals,
        poolAddr: pool.poolAddr
      };
      return mapping;
    },
    {} as Record<string, PoolMapping>
  );
}

export const getTokenSymbol = (symbol: string | undefined): string => {
  if (!symbol) return "";
  switch (symbol) {
    case "WBTC":
      return "BTC";
    case "WETH":
      return "ETH";
    default:
      return symbol;
  }
};

export const getPoolTokens = (pool: string): string[] => {
  return pool.split("/").map((p) => p.trim());
};

export const getActionType = (
  action?: "AL" | "RL" | "PC" | "OL" | "CL" | "OS" | "CS"
): string => {
  switch (action) {
    case "AL":
      return "Add Liquidity";
    case "RL":
      return "Remove Liquidity";
    case "PC":
      return "Create Pool";
    default:
      return "";
  }
};

export const POOL_ID_MAP = {
  ETH: {
    id: "weth",
    symbol: "weth",
    name: "WETH",
    vs: "usd"
  },
  BTC: {
    id: "wrapped-bitcoin",
    symbol: "wbtc",
    name: "Wrapped Bitcoin",
    vs: "usd"
  },
  CBETH: {
    id: "coinbase-wrapped-staked-eth",
    symbol: "cbeth",
    name: "Coinbase Wrapped Staked ETH",
    vs: "usd"
  },
  DAI: {
    id: "dai",
    symbol: "dai",
    name: "Dai",
    vs: "usd"
  },
  LINK: {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    vs: "usd"
  },
  "LINK-ETH": {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    vs: "eth"
  },
  USDC: {
    id: "usd-coin",
    symbol: "usdc",
    name: "USDC",
    vs: "usd"
  },
  USDT: {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    vs: "usd"
  }
} as const;
