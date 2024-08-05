"use client";

import notification from "@components/common/notification";
import { useAccount } from "wagmi";
import { useLocalStorage, useIsClient } from "usehooks-ts";
import { Button } from "@components/ui/button";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { usePoolsStore } from "@store/poolsStore";
import { Address } from "viem";
import { useDailyData } from "@lib/hooks/useDailyData";
import { usePools } from "@lib/hooks/usePools";
import { DailyInfo } from "@squaredlab-io/sdk/src/subgraph";
import { formatDate, getVolumeTimeseries } from "@components/PoolOverview/helper";

export default function TestNew() {
  const isClient = useIsClient();

  const { selectedPool } = usePoolsStore();

  const { pools, isFetching: fetchingPools } = usePools();

  const { dailyData, isFetching, refetch } = useDailyData({
    poolAddress: pools[0]?.poolAddr as Address,
    paused: true
  });

  const { address } = useAccount();

  const getTime = () => {
    if (dailyData) console.log(getVolumeTimeseries(dailyData));
  };

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  return (
    <main className="flex-col-center gap-3">
      <p>{!address ? "Connect wallet first!" : `Connected: ${address}`}</p>
      <Button disabled={pools.length === 0} onClick={refetch}>
        Daily data
      </Button>
      <Button
        disabled={dailyData?.length === 0}
        onClick={getTime}
      >
        getVolume
      </Button>
      <h4>
        {isFetching
          ? "fetching data..."
          : dailyData && dailyData.length > 0
            ? `daily data fetched ${dailyData.length}`
            : "not fetching"}
      </h4>
      <h4>
        {fetchingPools
          ? "fetching pools..."
          : pools.length > 0
            ? `${pools[0].pool} fetched`
            : "not fetching"}
      </h4>
    </main>
  );
}
