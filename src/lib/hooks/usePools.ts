import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";

interface ReturnType {
  pools: PoolInfo[] | undefined;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export function usePools(paused = false) {
  const { potentia } = usePotentiaSdk();

  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { poolsData, updatePoolsData } = usePoolsStore();

  const [value, setValue] = useLocalStorage("genie:pools", "");

  const getPools = async () => {
    try {
      setIsFetching(true);
      const data = await potentia?.getPools();
      console.log("pools", data);
      setPools(data ?? []);
      setValue(JSON.stringify(data ?? []));
    } catch (error) {
      console.error("Failed to fetch pools.");
      setIsError(true);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  // setting the global _pools data if available
  const _pools = useMemo(() => {
    if (poolsData?.length) {
      // 1. checking if pools exists already
      return poolsData;
    } else if (pools.length) {
      // 2. if not, re/fetch pools
      return pools;
    } else {
      return undefined;
    }
  }, [poolsData, pools]);

  useEffect(() => {
    if (potentia && !paused) {
      if (value !== "") {
        setPools(JSON.parse(value));
      }
      getPools();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia, value]);

  useEffect(() => {
    if (_pools && _pools.length > 0) {
      updatePoolsData(_pools);
    }
  }, [_pools]);

  return {
    pools: _pools,
    isFetching,
    refetch: getPools
  } satisfies ReturnType;
}
