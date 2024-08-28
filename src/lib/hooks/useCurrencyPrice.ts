import { useMemo } from "react";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { makeApiRequest, makeMarketDataApiRequest } from "@lib/datafeed/helpers";
import { getTokenSymbol } from "@lib/utils/pools";
import { REFETCH_INTERVAL } from "@lib/constants";
import { getPercentChange } from "@lib/utils/getPercentChange";

type DailyData = {
  time: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
  close: number;
  conversionType: string;
  conversionSymbol: string;
};

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
  isFetching: boolean;
  daily: DailyData | undefined;
  isDailyFetching: boolean;
  dailyChange: number;
  marketData: MarketData | undefined;
  isMarketDataFetching: boolean;
  fetchPrice: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<number | undefined, Error>>;
  refetchMarketData: (
    (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
  )
}

const POOL_ID_MAP = {
  "ETH": {
    "id": "weth",
    "symbol": "weth",
    "name": "WETH",
  },
  "BTC": {
    "id": "wrapped-bitcoin",
    "symbol": "wbtc",
    "name": "Wrapped Bitcoin"
  }
} as const;

type PoolSymbol = keyof typeof POOL_ID_MAP | "";

export function useCurrencyPrice(symbol = ""): ReturnType {
  const _symbol = getTokenSymbol(symbol);
  const newSymbol = getTokenSymbol(symbol) as PoolSymbol;

  const fetchPrice = async (): Promise<number | undefined> => {
    try {
      const result: { USD: number } = await makeApiRequest(
        `data/price?fsym=${_symbol.toUpperCase()}&tsyms=USD`
      );
      // console.log(`${symbol} price`, result);
      return result.USD;
    } catch (error) {
      console.error("Error while fetching price.");
    }
  };

  const fetchDailyData = async () => {
    try {
      const result = await makeApiRequest(
        `data/v2/histoday?fsym=${_symbol.toUpperCase()}&tsym=USD&limit=1`
      );
      const data: DailyData[] = result.Data.Data;
      // console.log(`${symbol} daily data`, data);
      return data[1];
    } catch (error) {
      console.error("Error while fetching daily data");
    }
  };

  const fetchMarketData = async () => {
    if (newSymbol === "") {
      console.error(`No mapping found for symbol: ${newSymbol}`);
      return;
    }
    try {
      const result = await makeMarketDataApiRequest(
        // `coins/markets?vs_currency=usd&ids=${POOL_ID_MAP[newSymbol].id}`
        `coins/markets?vs_currency=usd&ids=weth`
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

  // Given symbol's current price
  const { data, status, error, isError, isFetching, refetch } = useQuery({
    queryKey: ["currencyPrice", symbol],
    queryFn: fetchPrice,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!symbol
  });

  // Previous day's 24h High and Low
  const { data: daily, isFetching: isDailyFetching } = useQuery({
    queryKey: ["dailyData", symbol],
    queryFn: fetchDailyData,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!symbol
  });

  // all the market data
  const { data: marketData, isFetching: isMarketDataFetching, refetch: refetchMarketData } = useQuery({
    queryKey: ["marketData", symbol],
    queryFn: fetchMarketData,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!symbol
  });

  // Current price's percentage change from previous day Closing Price
  const dailyChange = useMemo(() => {
    return getPercentChange(daily?.close, data);
  }, [data, daily]);

  return {
    price: data ?? 0,
    isFetching,
    daily,
    dailyChange,
    isDailyFetching,
    fetchPrice: refetch,
    marketData,
    isMarketDataFetching,
    refetchMarketData
  } satisfies ReturnType;
}
