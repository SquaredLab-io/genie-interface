"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";

// Portfolio imported dynamically
const Portfolio = dynamic(() =>
  import("@components/Portfolio").then((mod) => mod.default)
);

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  const [notFound, setNotFound] = useState(false);

  const { pools, isFetching, refetch } = usePools();
  const { isMounted } = useIsMounted();

  const { poolsData, updatePoolsData } = usePoolsStore();

  const _pools = useMemo(() => {
    if (poolsData?.length) {
      // 1. checking if pools exists already
      return poolsData;
    } else if (pools.length) {
      // 2. if not, re/fetch pools
      refetch();
      return pools;
    }
    return [];
  }, [poolsData, pools]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!_pools) setNotFound(true);
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (pools.length) {
      // If there're pools, update it globally
      updatePoolsData(pools);
      console.log("pools updated", pools);
    }
  }, [pools]);

  if (!isMounted)
    return (
      <div className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex">
        <SpinnerIcon stroke="#01A1FF" />
        <span>preparing pool...</span>
      </div>
    );

  return (
    <main className="border-t border-secondary-gray page-center">
      {isFetching && !_pools ? (
        <>
          <SpinnerIcon stroke="#01A1FF" />
          <span>fetching pools...</span>
        </>
      ) : notFound ? (
        <span>sorry some error, refresh please!</span>
      ) : (
        <Portfolio />
      )}
    </main>
  );
}
