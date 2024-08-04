"use client";

import notification from "@components/common/notification";
import { useAccount } from "wagmi";
import { useLocalStorage, useIsClient } from "usehooks-ts";
import { Button } from "@components/ui/button";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { usePoolsStore } from "@store/poolsStore";
import { Address } from "viem";

export default function TestNew() {
  const isClient = useIsClient();

  const { selectedPool } = usePoolsStore();

  const { tokenPrices, isFetching, refetch } = useTokenPrice({
    poolAddress: selectedPool()?.poolAddr as Address,
    paused: true
  });

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
      <p>{!address && "Connect wallet first!"}</p>
      <Button onClick={refetch}>Token Prices</Button>
      <h4>{isFetching ? "fetching price...": "not fetching"}</h4>
    </main>
  );
}
