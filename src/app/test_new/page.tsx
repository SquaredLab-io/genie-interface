"use client";

import { useAccount } from "wagmi";
import { useIsClient, useWindowSize } from "usehooks-ts";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePools } from "@lib/hooks/usePools";
import { _getDecimalAdjusted } from "@lib/utils/formatting";
import Loading from "@app/loading";

export default function TestNew() {
  const { width } = useWindowSize();
  const isClient = useIsClient();
  const { isConnected, isConnecting, address } = useAccount();
  const { pools, isFetching } = usePools();

  if (width === 0 || !isClient) return <Loading />;
  return (
    <main className="page-center items-center justify-center gap-3">
      <span>
        Wallet status:{" "}
        {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Not Connected"}
      </span>
      {isConnected && <span>{address}</span>}
      <span>{isFetching && !pools ? "fetching..." : "fetched"}</span>
      {<span>Selected Pool: {pools?.[0].pool}</span>}
    </main>
  );
}
