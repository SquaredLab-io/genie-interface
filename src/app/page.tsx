"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { PoolInfo } from "@squaredlab-io/sdk/src";
import LoadingScreen from "@components/common/loading-screen";
import { useAccount } from "wagmi";
import ConnectWallet from "@components/common/ConnectWallet";

// Portfolio imported dynamically
const Portfolio = dynamic(() =>
  import("@components/Portfolio").then((mod) => mod.default)
);

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  // const [notFound, setNotFound] = useState(false);
  const { poolsData, updatePoolsData, selectedPool } = usePoolsStore();

  const { pools, isFetching } = usePools();
  const { address } = useAccount();

  const { isMounted } = useIsMounted();

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

  useEffect(() => {
    if (_pools && _pools.length > 0) {
      updatePoolsData(_pools);
    }
    console.log("_pools @app/page", _pools);
  }, [_pools]);

  if (!isMounted) return <LoadingScreen />;
  else if (!address)
    return (
      <main className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex">
        <h3 className="text-2xl">Please Connect Wallet</h3>
        <ConnectWallet />
      </main>
    );
  else if (isFetching && !_pools) return <LoadingScreen />;

  return (
    <main className="border-t border-secondary-gray page-center">
      <Portfolio />
    </main>
  );
}
