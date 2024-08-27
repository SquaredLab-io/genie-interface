import { useMemo } from "react";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { makeApiRequest } from "@lib/datafeed/helpers";
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

interface ReturnType {
  price: number;
  isFetching: boolean;
  daily: DailyData | undefined;
  isDailyFetching: boolean;
  dailyChange: number;
  fetchPrice: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<number | undefined, Error>>;
}

export function useCurrencyPrice(symbol = ""): ReturnType {
  const _symbol = getTokenSymbol(symbol);

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
    fetchPrice: refetch
  } satisfies ReturnType;
}
