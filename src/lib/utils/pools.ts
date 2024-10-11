import { PoolInfo } from "@squaredlab-io/sdk";

export const UNSUPPORTED_POOLS = [
  // "0x08EF999e4383FE62660022b73D145201bD5023d4", // WETH^2
  // "0x9cdAA94733a682013Ff8AfD72BA59FB63619C98d" // WETH^8
  "0x4488107701B77Db056f20b314002aFd1B513605C" // USDT^4
];

export const getSupportedPools = (pools: PoolInfo[] | undefined) => {
  if (!pools || pools.length === 0) return pools;
  return pools.filter((pool) => !UNSUPPORTED_POOLS.includes(pool.poolAddr));
};

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
