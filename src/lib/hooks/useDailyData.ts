import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { DailyInfo, DailyInfoArray } from "@squaredlab-io/sdk";
import getUrqlClient from "@lib/utils/urql/get-urql-client";
import notification from "@components/common/notification";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
}

interface ReturnType {
  dailyData: DailyInfo[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<DailyInfo[] | undefined, Error>>;
}

// URQL Client
const [client] = getUrqlClient();

const getDailyData = async (pool: string): Promise<DailyInfoArray> => {
  const filterQuery = `{pool: "${pool}"}`;
  const QUERY = `
   query MyQuery {
      dailyInfos(
        where: ${filterQuery}
        orderBy: "date"
        orderDirection: "desc"
      ) {
        items {
          fee
          lastLongPrice
          date
          lastShortPrice
          lastTvl
          maxTvl
          minTvl
          pool
          volume
          id
        }
      }
    }    
  `;

  let res = await client.query<DailyInfoArray>(QUERY, {});
  if (res.data == null) {
    throw new Error("No data found");
  }
  return res.data;
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
      return info.dailyInfos.items;
    } catch (error) {
      notification.error({
        id: "daily-data",
        title: "Failed to fetch daily data",
        description: `${error}`
      });
    }
  };

  const { data, isFetching, refetch, isError, error } = useQuery({
    queryKey: ["poolDailyInfo", poolAddress],
    queryFn: fetch,
    enabled: !!client && !!poolAddress && !paused
  });

  return {
    dailyData: data,
    isFetching,
    refetch
  } satisfies ReturnType;
}
