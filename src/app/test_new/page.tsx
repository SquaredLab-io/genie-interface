"use client";

import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { _getDecimalAdjusted } from "@lib/utils/formatting";

export default function TestNew() {
  const isClient = useIsClient();
  const { isConnected, isConnecting, address } = useAccount();
  const { pools, isFetching } = usePools();
  const { selectedPool } = usePoolsStore();

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }
  const WalletStatus = () => (
    <>
      <span>
        Wallet status:{" "}
        {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Not Connected"}
      </span>
      {isConnected && <span>{address}</span>}
    </>
  );
  const PoolsStatus = () => (
    <>
      <span>{isFetching && !pools ? "fetching..." : "fetched"}</span>
      {<span>Selected Pool: {selectedPool()?.pool}</span>}
    </>
  );

  return (
    <main className="flex-col-center gap-3">
      <WalletStatus />
      <PoolsStatus />
    </main>
  );
}
