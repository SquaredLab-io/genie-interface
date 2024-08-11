"use client";

import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";

export default function TestNew() {
  const isClient = useIsClient();
  const { isConnected } = useAccount();

  const { pools, isFetching } = usePools();
  const { selectedPool } = usePoolsStore();

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  return (
    <main className="flex-col-center gap-3">
      <span>{isConnected ? "Connected" : "Not Connected"}</span>
      <span>{isFetching && !pools ? "fetching..." : "fetched"}</span>
      {<span>Selected Pool: {selectedPool()?.pool}</span>}
    </main>
  );
}
