"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import LoadingScreen from "@components/common/loading-screen";

// Trade Interface imported dynamically
const Trade = dynamic(() =>
  import("@components/Trade").then((mod) => mod.default)
);

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  const { pools, isFetching } = usePools();
  const { poolsData, updatePoolsData } = usePoolsStore();
  
  const { isMounted } = useIsMounted();
  // const [notFound, setNotFound] = useState(false);

  // setting the pools if exists globally
  const _pools: PoolInfo[] | undefined = useMemo(() => {
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

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (!_pools) setNotFound(true);
  //   }, 20000);
  //   return () => clearTimeout(timeout);
  // }, []);

  // updating the pool globally
  useEffect(() => {
    if (_pools && _pools.length > 0) {
      updatePoolsData(_pools);
    }
  }, [_pools]);

  if (!isMounted) return <LoadingScreen />;

  else if (isFetching && !_pools) return <LoadingScreen />;

  return (
    <main className="border-t border-secondary-gray page-center">
      <Trade />
    </main>
  );
}
