"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import PoolOverview from "@components/PoolOverview";

export default function Overview() {
  const [notFound, setNotFound] = useState(false);
  const { id } = useParams();
  const isMounted = useIsMounted();
  // get Pools
  const { pools, isFetching } = usePools();
  const { poolsData } = usePoolsStore();

  console.log("poolsdata", poolsData);

  const currentPool = useMemo(() => {
    if (poolsData?.length) { // 1. checking if pools exists globally
      const symbol = (id as string).toLowerCase();
      const pool = poolsData.filter((pool) => pool.underlying.toLowerCase() === symbol);
      return pool[0] ?? undefined;
    } else if (pools.length) { // 2. if not pools, fetch them
      const symbol = (id as string).toLowerCase();
      const pool = pools.filter((pool) => pool.underlying.toLowerCase() === symbol);
      return pool[0] ?? undefined;
    }
    return undefined;
  }, [poolsData, pools]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!currentPool) setNotFound(true);
    }, 10000);
    return () => clearTimeout(timeout);
  });

  if (!isMounted) return <main className="">Preparing...</main>;

  return (
    <main>
      {notFound ? (
        <p>pool not found</p>
      ) : isFetching && currentPool == undefined ? (
        <p>fetching pool...</p>
      ) : (
        <PoolOverview overviewPool={currentPool!} />
      )}
    </main>
  );
}
