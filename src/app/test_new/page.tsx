"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useIsClient, useWindowSize } from "usehooks-ts";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { _getDecimalAdjusted } from "@lib/utils/formatting";
import MobileInfoScreen from "@components/common/MobileInfoScreen";
import Loading from "@app/loading";

export default function TestNew() {
  const { width } = useWindowSize();

  const isClient = useIsClient();
  const { isConnected, isConnecting, address } = useAccount();
  const { pools, isFetching } = usePools();
  const { selectedPool } = usePoolsStore();

  const TestNew = () => (
    <main className="page-center items-center justify-center gap-3">
      <span>
        Wallet status:{" "}
        {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Not Connected"}
      </span>
      {isConnected && <span>{address}</span>}
      <span>{isFetching && !pools ? "fetching..." : "fetched"}</span>
      {<span>Selected Pool: {selectedPool()?.pool}</span>}
    </main>
  );

  const render = useMemo(() => {
    return width <= 1024 ? MobileInfoScreen : <TestNew />;
  }, [width]);

  if (width === 0 || !isClient) return <Loading />;
  return render;
}
