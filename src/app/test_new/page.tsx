"use client";

import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { useIsClient } from "usehooks-ts";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { ChangeEvent, useState } from "react";
import useUnderlyingEstimateOut from "@lib/hooks/useUnderlyingEstimateOut";
import { formatNumber, getDecimalAdjusted } from "@lib/utils/formatting";

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

  const [quantity, setQuantity] = useState("");

  const { output, isFetching: isOutputFetching } = useUnderlyingEstimateOut({
    poolAddress: selectedPool()?.poolAddr as Address,
    amount: quantity,
    isLong: true
  });

  // Handler that updates Quantity and keep SliderValue in sync
  function inputHandler(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    setQuantity(input);
  }

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
      <div className="border p-2 flex flex-col items-start">
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
      </div>
      <div className="flex flex-col gap-5 items-start max-w-sm">
        <input
          type="number"
          value={quantity}
          placeholder="0"
          onChange={inputHandler}
          id="quantity"
          className="border border-secondary-gray bg-transparent p-2 w-full placeholder:text-[#6D6D6D] text-white font-semibold text-sm/6 focus:outline-none"
        />
        <span>
          Output:{" "}
          {isOutputFetching
            ? "..."
            : !isNaN(parseFloat(quantity))
              ? formatNumber(
                  getDecimalAdjusted(output, selectedPool()?.underlyingDecimals)
                )
              : "-"}
        </span>
      </div>
    </main>
  );
}
