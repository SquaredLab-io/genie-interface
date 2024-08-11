import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";

interface ReturnType {
  pools: PoolInfo[];
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export function usePools(paused = false) {
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [value, setValue] = useLocalStorage("genie:pools", "");

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
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

  useEffect(() => {
    if (potentia && !paused) {
      if (value !== "") {
        setPools(JSON.parse(value));
      }
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia, value]);

  return {
    pools,
    isFetching,
    refetch
  } satisfies ReturnType;
}
