import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";
import { FundingInfo } from "@squaredlab-io/sdk/src/pool";
import { useLocalStorage } from "usehooks-ts";
import { usePoolsStore } from "@store/poolsStore";

interface PropsType {
  poolAddress: string | undefined;
  paused?: boolean;
}

export interface TokenPrice {
  lastLongP: string;
  longDailyChange: string;
  lastShortP: string;
  shortDailyChange: string;
  fundingInfo: FundingInfo;
  volume: string;
  dollarVol: string;
  tvl: string;
}

export interface ReturnType {
  tokenPrices: TokenPrice | undefined;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

/**
 *
 * @param poolAddress
 * @param paused Pause the auto fetching
 * @returns openOrders, isFetching, refetch
 */
export function useTokenPrice({ poolAddress, paused = false }: PropsType): ReturnType {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // store
  const { selectedPool } = usePoolsStore();

  // using local-storage api for caching
  const [value, setValue] = useLocalStorage(
    `genie:token-prices:${selectedPool()?.underlyingAddress}`,
    ""
  );

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    try {
      setIsFetching(true);
      console.log("pooladdress", poolAddress);
      const tokenprice = await potentia?.fetchTokenPrice(poolAddress!);
      console.log("tokenprice", tokenprice);
      setTokenPrices(tokenprice);
      setValue(JSON.stringify(tokenprice));
      // setValue(JSON.stringify(openOrders));
    } catch (error) {
      notification.error({
        title: "Failed to fetch Token Prices",
        description: `${error}`
      });
      setIsError(true);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (potentia && !paused && poolAddress) {
      if (value !== "") {
        const parsedValue = JSON.parse(value);
        setTokenPrices(parsedValue);
      }
      refetch();
    }
  }, [potentia, poolAddress]);

  return {
    tokenPrices,
    isFetching,
    refetch
  } satisfies ReturnType;
}
