import { DailyInfo, DailyQueryResult } from "@squaredlab-io/sdk/src/subgraph";
import notification from "@components/common/notification";
import { cacheExchange, Client, fetchExchange } from "urql";
import { PONDER_URL } from "@lib/keys";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
}

interface ReturnType {
  dailyData: DailyInfo[] | undefined;
  isFetching: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<DailyInfo[] | undefined, Error>>;
}

// URQL Client for Subgraph
const urqlClient = new Client({
  url: PONDER_URL,
  exchanges: [cacheExchange, fetchExchange]
});

const getDailyData = async (pool: string): Promise<DailyInfo[]> => {
  const QUERY = `
    query MyQuery {
      dailyInfos(orderBy: date, orderDirection: desc, where: {pool: "${pool}"}) {
          fee
          lastLongPrice
          date
          lastShortPrice
          lastTvl
          maxTvl
          minTvl
          pool
          volume
      }
    }`;
  const result = await urqlClient.query<DailyQueryResult>(QUERY, {});

  if (result.data == null) {
    throw new Error("No data found");
  }

  if (result.data!.dailyInfos.length > 0) {
    return result.data!.dailyInfos;
  }
  return [];
};

/**
 *
 * @param poolAddress
 * @param paused Pause the auto fetching
 * @returns dailyInfos, isFetching, refetch
 */
export function useDailyData({ poolAddress, paused = false }: PropsType): ReturnType {
  const fetch = async () => {
    try {
      const info = await getDailyData(poolAddress);
      console.log("dailyData @useDailyData", info);
      return info;
    } catch (error) {
      notification.error({
        id: "daily-data",
        title: "Failed to fetch daily data",
        description: `${error}`
      });
    }
  };

  const {
    data,
    isFetching,
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ["poolDailyInfo", poolAddress],
    queryFn: fetch,
    // refetchInterval: false,
    enabled: urqlClient && !!poolAddress && !paused
  });

  return {
    dailyData: data,
    isFetching,
    refetch
  } satisfies ReturnType;
}
