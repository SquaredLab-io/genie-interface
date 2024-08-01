"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
// import PoolOverview from "@components/PoolOverview";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import dynamic from "next/dynamic";

// PoolOverview imported dynamically
const PoolOverview = dynamic(() =>
  import("@components/PoolOverview").then((mod) => mod.default)
);

export default function Overview() {
  const [notFound, setNotFound] = useState(false);

  const { id } = useParams();
  const isMounted = useIsMounted();
  const { poolsData, updatePoolsData } = usePoolsStore(); 

  // get Pools
  const { pools, isFetching } = usePools();
  console.log("poolsdata", poolsData);

  const currentPool = useMemo(() => {
    if (poolsData?.length) {
      // 1. checking if pools exists globally
      const symbol = (id as string).toLowerCase();
      const pool = poolsData.filter((pool) => pool.underlying.toLowerCase() === symbol);
      return pool[0];
    } else if (pools.length) {
      // 2. if not pools, fetch them
      const symbol = (id as string).toLowerCase();
      const pool = pools.filter((pool) => pool.underlying.toLowerCase() === symbol);
      return pool[0];
    }
    return undefined;
  }, [poolsData, pools]);

  // If there're pools, update it globally
  useEffect(() => {
    if (pools.length) {
      updatePoolsData(pools);
      console.log("pools updated", pools);
    }
  }, [pools]);

  // Set to 404 if nothing fetched for 10 secs
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!currentPool) setNotFound(true);
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  if (!isMounted)
    return (
      <div className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex">
        <SpinnerIcon stroke="#01A1FF" />
        <span>preparing pool...</span>
      </div>
    );

  return (
    <main className="page-center overflow-y-auto">
      {isFetching && currentPool == undefined ? (
        <div className="size-full flex-col-center gap-5 font-sans-ibm-plex">
          <SpinnerIcon stroke="#01A1FF" />
          <span>preparing pool...</span>
        </div>
      ) : notFound ? (
        <div className="size-full flex-col-center font-sans-ibm-plex">
          <span>Pool Not Found</span>
        </div>
      ) : (
        <PoolOverview overviewPool={currentPool} />
      )}
    </main>
  );
}
