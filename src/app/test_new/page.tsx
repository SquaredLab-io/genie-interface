"use client";

import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { useIsClient } from "usehooks-ts";
import { Address } from "viem";
import { useAccount } from "wagmi";

export default function TestNew() {
  const isClient = useIsClient();
  const { isConnected, isConnecting, address } = useAccount();
  const { pools, isFetching } = usePools();
  const { selectedPool } = usePoolsStore();

  const { data, isFetching: isBalanceFetching } = _useTokenBalance({
    token: selectedPool()?.underlyingAddress as Address,
    decimals: selectedPool()?.underlyingDecimals,
    symbol: selectedPool()?.underlying
  });

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
      <>
        <span>
          {isBalanceFetching ? "fetching..." : !!data ? "fetched" : "not fetched"}
        </span>
        {data && (
          <>
            <span>
              {selectedPool()?.underlying} balance: {data?.formatted}
            </span>
            <span>{data?.value}</span>
            <span>{data?.decimals}</span>
            <span>{data?.symbol}</span>
          </>
        )}
      </>
    </main>
  );
}
