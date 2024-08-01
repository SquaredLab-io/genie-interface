import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { PoolInfo } from "@lib/types/common";
import notification from "@components/common/notification";

interface ReturnType {
  pools: PoolInfo[] | undefined;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export function usePools(paused = false) {
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    try {
      setIsFetching(true);
      const pools = await potentia?.getPools();
      console.log("pools", pools);
      setPools(pools ?? []);
    } catch (error) {
      notification.error({
        title: "Failed to fetch pools!",
        description: "Please try again"
      });
      setIsError(true);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (potentia && !paused) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia]);

  return {
    pools,
    isFetching,
    refetch
  } satisfies ReturnType;
}
