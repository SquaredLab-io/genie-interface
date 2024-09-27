"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { usePools } from "@lib/hooks/usePools";
import LoadingLogo from "@components/icons/loading-logo";
import PoolOverview from "@components/PoolOverview";

// PoolOverview imported dynamically
// const PoolOverview = dynamic(() =>
//   import("@components/PoolOverview").then((mod) => mod.default)
// );

export default function Overview() {
  const { pools, isFetching, status } = usePools();

  const { id } = useParams();
  const queryParams = useSearchParams();
  const power = queryParams.get("power");
  const _id = Array.isArray(id) ? id[0] : id;

  // finding the pool based on id in url
const overviewPool = useMemo(() => {
    if (status === "success" && pools) {
      return pools.find(
        (pool) =>
          pool.underlying.toLowerCase() === _id.toLowerCase() &&
          pool.power === parseInt(power!)
      );
    }
  }, [id, pools, power, status]);

  // Show loading state while fetching
  if (status === "pending" || isFetching) {
    return (
      <main className="page-center overflow-y-auto">
        <div className="size-full flex-col-center gap-5 font-sans-ibm-plex">
          <LoadingLogo size={100} />
        </div>
      </main>
    );
  }

  // If there's an error fetching pools
  if (status === "error") {
    return (
      <main className="page-center items-center justify-center text-3xl">
        <p>Error fetching pools. Please try again later.</p>
      </main>
    );
  }

  // Not fetching pools anymore, but didn't find the pool for overview
  if (status === "success" && !overviewPool) {
    return (
      <main className="page-center items-center justify-center text-3xl">
        404: {_id.toUpperCase()} Pool not found
      </main>
    );
  }

  return (
    <main className="page-center">
      <PoolOverview overviewPool={overviewPool!} />
    </main>
  );
}
