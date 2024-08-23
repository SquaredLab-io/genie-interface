"use client";

import dynamic from "next/dynamic";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePools } from "@lib/hooks/usePools";
import LoadingScreen from "@components/common/loading-screen";

// Trade Interface imported dynamically
const Trade = dynamic(() => import("@components/Trade").then((mod) => mod.default));

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  const { pools, isFetching } = usePools();
  const { isMounted } = useIsMounted();

  if (!isMounted) return <LoadingScreen />;
  else if (isFetching && !pools) return <LoadingScreen />;
  else if (pools && pools.length === 0) return <main className="page-center items-center justify-center text-3xl">404: Pools not found</main>

  return (
    <main className="page-center overflow-x-hidden">
      <Trade />
    </main>
  );
}
