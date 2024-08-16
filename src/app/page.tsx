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

  return (
    <main className="page-center">
      <Trade />
    </main>
  );
}
