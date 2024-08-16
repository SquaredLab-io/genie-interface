"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import dynamic from "next/dynamic";
import LoadingLogo from "@components/icons/loading-logo";

// PoolOverview imported dynamically
const PoolOverview = dynamic(() =>
  import("@components/PoolOverview").then((mod) => mod.default)
);

export default function Overview() {
  // TODO: Needs to be deprecated
  const [notFound, setNotFound] = useState(false);

  const { id } = useParams();
  const _id = Array.isArray(id) ? id[0] : id;
  const isMounted = useIsMounted();

  const { pools, isFetching } = usePools();

  // finding the pool based on id in url
  const overviewPool = useMemo(() => {
    const _pool = pools?.find(
      (pool) => pool.underlying.toLowerCase() === _id.toLowerCase()
    );
    return _pool;
  }, [id, pools]);

  // Loading Screen before Mounting
  if (!isMounted)
    return (
      <div className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex">
        <SpinnerIcon stroke="#01A1FF" />
        <span>preparing pool...</span>
      </div>
    );

  return (
    <main className="page-center overflow-y-auto">
      {isFetching && !overviewPool ? (
        <div className="size-full flex-col-center gap-5 font-sans-ibm-plex">
          <LoadingLogo size={100} />
        </div>
      ) : notFound ? (
        <div className="size-full flex-col-center font-sans-ibm-plex">
          <span>Pool Not Found</span>
        </div>
      ) : (
        <PoolOverview overviewPool={overviewPool} />
      )}
    </main>
  );
}
