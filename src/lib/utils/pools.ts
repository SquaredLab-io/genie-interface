import { PoolMapping } from "@lib/hooks/usePools";
import { isStaging } from "@lib/keys";
import { PoolInfo } from "@squaredlab-io/sdk";

export const SUPPORTED_POOLS = [
  "0xf787580558f2d858ad698Ae577821F2926E02ae0", // WETH^2
  "0xf5eDEDbFe9c0Ec966d09F2D15B47CD36305aE1FA", // WETH^8
  "0x82533d23622572ff04702e29F751558633e2d534", // BTC^16
  "0x4f8177Fd388ff57fEDe69c82CCF58473f52c6Ea1", // BTC^8
  "0xC5805396de7Dfb62C639AB0928621BAF72F63c20", // BTC^2
  "0x3df3c225EC6213398F234B5fD35edfE26a3C39fA" // BTC^4
];

export const getSupportedPools = (pools: PoolInfo[] | undefined) => {
  if (!pools || pools.length === 0) return pools;

  if (isStaging) {
    return pools; // Return all pools in Staging
  }
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
