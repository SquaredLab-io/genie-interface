"use client";

import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { Button } from "@components/ui/button";
import { usePools } from "@lib/hooks/usePools";

export default function TestNew() {
  const isClient = useIsClient();

  const { pools, isFetching, refetch } = usePools(true);

  const { address } = useAccount();

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  return (
    <main className="flex-col-center gap-3">
      <p>{!address ? "Connect wallet first!" : `Connected: ${address}`}</p>
      <Button onClick={refetch}>Fetch pools</Button>
      <h4>
        {isFetching
          ? "fetching pools..."
          : pools.length > 0
            ? `${pools[0].pool} fetched`
            : "not fetching"}
      </h4>
    </main>
  );
}
