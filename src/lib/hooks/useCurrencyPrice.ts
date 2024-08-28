import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { makeMarketDataApiRequest } from "@lib/datafeed/helpers";
import { getTokenSymbol } from "@lib/utils/pools";
import { REFETCH_INTERVAL } from "@lib/constants";

interface MarketData {
  current_price: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  max_supply: number;
};

interface ReturnType {
  price: number;
  marketData: MarketData | undefined;
  isMarketDataLoading: boolean;
  refetchMarketData: (
    (options?: RefetchOptions) => Promise<QueryObserverResult<MarketData | undefined, Error>>
  )
}

const POOL_ID_MAP = {
  "ETH": {
    "id": "weth",
    "symbol": "weth",
    "name": "WETH",
    "vs": "usd"
  },
  "BTC": {
    "id": "wrapped-bitcoin",
    "symbol": "wbtc",
    "name": "Wrapped Bitcoin",
    "vs": "usd"
  },
  "CBETH": {
    "id": "coinbase-wrapped-staked-eth",
    "symbol": "cbeth",
    "name": "Coinbase Wrapped Staked ETH",
    "vs": "usd"
  },
  "DAI": {
    "id": "dai",
    "symbol": "dai",
    "name": "Dai",
    "vs": "usd"
  },
  "LINK": {
    "id": "chainlink",
    "symbol": "link",
    "name": "Chainlink",
    "vs": "usd"
  },
  "LINK-ETH": {
    "id": "chainlink",
    "symbol": "link",
    "name": "Chainlink",
    "vs": "eth"
  },
  "USDC": {
    "id": "usd-coin",
    "symbol": "usdc",
    "name": "USDC",
    "vs": "usd"
  },
  "USDT": {
    "id": "tether",
    "symbol": "usdt",
    "name": "Tether",
     "vs": "usd"
  },
} as const;

type PoolSymbol = keyof typeof POOL_ID_MAP | "";

export function useCurrencyPrice(symbol = ""): ReturnType {
  const _symbol = getTokenSymbol(symbol) as PoolSymbol;

  const fetchMarketData = async () => {
    if (_symbol === "") {
      console.error("No mapping found");
      return;
    }
    try {
      const result = await makeMarketDataApiRequest(
        `coins/markets?vs_currency=${POOL_ID_MAP[_symbol].vs}&ids=${POOL_ID_MAP[_symbol].id}`
      );
      const { 
        current_price,
        market_cap,
        high_24h,
        low_24h,
        price_change_percentage_24h,
        max_supply
      } = result[0];
      return { 
        current_price,
        market_cap,
        high_24h,
        low_24h,
        price_change_percentage_24h,
        max_supply
      } as MarketData;
    } catch (error) {
      console.error("Error while fetching market data");
    }
  }

  // all the market data
  const { data: marketData, isFetching: isMarketDataLoading, refetch: refetchMarketData } = useQuery({
    queryKey: ["marketData", symbol],
    queryFn: fetchMarketData,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!symbol
  });

  // Current price's percentage change from previous day Closing Price
  /* const dailyChange = useMemo(() => {
    return getPercentChange(daily?.close, data);
  }, [data, daily]);
 */
  return {
    price: marketData?.current_price ?? 0,
    marketData,
    isMarketDataLoading,
    refetchMarketData
  } satisfies ReturnType;
}
