import { useEffect, useState } from "react";
import { DailyInfo, DailyQueryResult } from "@squaredlab-io/sdk/src/subgraph";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";
import { cacheExchange, Client, fetchExchange } from "urql";
import { SUBGRAPH_URL } from "@lib/keys";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
}

interface ReturnType {
  dailyData: DailyInfo[] | undefined;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

// URQL Client for Subgraph
const urqlClient = new Client({
  url: SUBGRAPH_URL,
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
  const [info, setInfo] = useState<DailyInfo[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  // const { address } = useAccount();

  // using local-storage api for caching
  // const [value, setValue] = useLocalStorage(`genie:open-order:${address}`, "");

  // const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    console.log("pooladdress", poolAddress);
    try {
      setIsFetching(true);
      const _info = await getDailyData(poolAddress);
      setInfo(_info);
      // setValue(JSON.stringify(_info));
      console.log("dailyData", _info);
    } catch (error) {
      notification.error({
        title: "Failed to fetch daily data",
        description: `${error}`
      });
      setIsError(true);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (urqlClient && !paused && poolAddress) {
      // if (value !== "") {
      //   setInfo(JSON.parse(value));
      // }
      refetch();
    }
  }, [urqlClient, poolAddress]);
  // }, [potentia, poolAddress]);

  return {
    dailyData: info,
    isFetching,
    refetch
  } satisfies ReturnType;
}
