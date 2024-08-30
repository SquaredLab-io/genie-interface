"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { usePools } from "@lib/hooks/usePools";
import LoadingLogo from "@components/icons/loading-logo";

// PoolOverview imported dynamically
const PoolOverview = dynamic(() =>
  import("@components/PoolOverview").then((mod) => mod.default)
);

export default function Overview() {
  const { pools, isFetching } = usePools();

  const { id } = useParams();
  const _id = Array.isArray(id) ? id[0] : id;

  // finding the pool based on id in url
  const overviewPool = useMemo(() => {
    const _pool = pools?.find(
      (pool) => pool.underlying.toLowerCase() === _id.toLowerCase()
    );
    return _pool;
  }, [id, pools]);

  // not fetching pools, but also didn't find the pool for overview
  if (!overviewPool && !isFetching) {
    return (
      <main className="page-center items-center justify-center text-3xl">
        404: {_id.toUpperCase()} Pool not found
      </main>
    );
  }

  return (
    <main className="page-center overflow-y-auto">
      {isFetching && !overviewPool ? (
        <div className="size-full flex-col-center gap-5 font-sans-ibm-plex">
          <LoadingLogo size={100} />
        </div>
      ) : (
        <PoolOverview overviewPool={overviewPool} />
      )}
    </main>
  );
}
