import { QueryStatus, useQuery } from "@tanstack/react-query";
import { FundingInfo } from "@squaredlab-io/sdk/src/interfaces/pool.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";
import { REFETCH_INTERVAL } from "@lib/constants";

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
  status: QueryStatus;
}

/**
 *
 * @param poolAddress
 * @param paused Pause the auto-fetching
 * @returns openOrders, isFetching, status
 */
export function useTokenPrice({ poolAddress, paused = false }: PropsType): ReturnType {
  const { potentia } = usePotentiaSdk();

  const fetchTokenPrice = async () => {
    try {
      const tokenprice = await potentia?.fetchTokenPrice(poolAddress!);
      // console.log("tokenprice", tokenprice);
      return tokenprice;
    } catch (error) {
      notification.error({
        title: "Failed to fetch Token Prices",
        description: `${error}`
      });
    }
  };

  const {
    data,
    status,
    error,
    isError,
    isFetching: fetchingPrice,
    refetch
  } = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: fetchTokenPrice,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!potentia && !!poolAddress
  });

  return {
    tokenPrices: data,
    isFetching: fetchingPrice,
    status
  } satisfies ReturnType;
}
