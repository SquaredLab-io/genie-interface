import { useEffect, useState } from "react";
import { makeApiRequest } from "@lib/datafeed/helpers";
import { getTokenSymbol } from "@lib/pools";

interface ReturnType {
  price: number;
  isLoading: boolean;
  volume: number;
  isVolLoading: boolean;
  fetchPrice: () => Promise<void>;
  fetchVol: () => Promise<void>;
}

export function useCurrencyPrice(symbol = ""): ReturnType {
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState<any>();
  const [isVolLoading, setVolIsLoading] = useState(false);
  const _symbol = getTokenSymbol(symbol);

  const pricePath = `data/price?fsym=${_symbol.toUpperCase()}&tsyms=USD`;
  const dailyVolPath = `data/symbol/histoday?fsym=${_symbol.toUpperCase()}&tsym=USD&limit=10`;

  const fetchPrice = async () => {
    try {
      const result = await makeApiRequest(pricePath);
      console.log(`${symbol} price`, result);
      setPrice(result.USD);
      setIsLoading(false);
    } catch (error) {
      console.error("Error while fetching price.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVol = async () => {
    try {
      const result = await makeApiRequest(dailyVolPath);
      // console.log("daily volume", result);
      setVolume(result.Data[10]);
      setVolIsLoading(false);
    } catch (error) {
      console.error("Error while fetching price.");
    } finally {
      setVolIsLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchPrice();
      // fetchVol();
    }
  }, [symbol]);

  return {
    price,
    isLoading,
    volume,
    isVolLoading,
    fetchPrice,
    fetchVol
  } satisfies ReturnType;
}
