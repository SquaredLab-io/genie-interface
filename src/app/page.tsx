"use client";

import dynamic from "next/dynamic";
import { usePools } from "@lib/hooks/usePools";
import Loading from "./loading";

// Trade Interface imported dynamically
const Trade = dynamic(() => import("@components/Trade").then((mod) => mod.default));

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  const { pools, isFetching } = usePools();

  if (isFetching && !pools) return <Loading />;
  else if (pools && pools.length === 0) {
    return (
      <main className="page-center items-center justify-center text-3xl">
        404: Pools not found
      </main>
    );
  }

  return (
    <main className="page-center">
      <Trade />
    </main>
  );
}
