"use client";

import { useState } from "react";
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

  // const [quantity, setQuantity] = useState("");

  // const { openOrders, isFetching: isOrdersFetching } = useOpenOrders({
  //   poolAddress: selectedPool()?.poolAddr as Address,
  //   paused: true
  // });

  // const longTokenBalance = new BigNumber(openOrders?.longPositionTab?.tokenSize ?? "0");
  // const shortTokenBalance = new BigNumber(openOrders?.shortPositionTab?.tokenSize ?? "0");

  // const isValid = !isNaN(parseFloat(quantity));

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

  // const amount = longTokenBalance
  //   .multipliedBy(BigNumber(isValid ? quantity : 0))
  //   .dividedBy(BigNumber(100));
  // const adjAmount = _getDecimalAdjusted(amount.toFixed(0), 18);
  // const deAdjAmount = BigNumber(adjAmount)
  //   .multipliedBy(10 ** 18)
  //   .toFixed(0);

  return (
    <main className="flex-col-center gap-3">
      <WalletStatus />
      <PoolsStatus />
      <div className="p-2 flex flex-col items-start">
        <span>
          {/* {isOrdersFetching ? "fetching..." : !!openOrders ? "fetched" : "not fetched"} */}
        </span>
        {/* {openOrders && (
          <div className="flex flex-col gap-2 items-start">
            <span>Long Balance: {longTokenBalance.toFixed(0)}</span>
            <span>Short Balance: {shortTokenBalance.toFixed(0)}</span>
          </div>
        )} */}
        {/* <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0"
          type="number"
          min={0}
          max={100}
          className="mt-5"
        /> */}
        {/* {isValid && <p>amount: {amount.toFixed(0)}</p>}
        {isValid && <p>adj. amount: {adjAmount}</p>}
        {isValid && <p>de adj. amount: {deAdjAmount}</p>}
        <p>Is Balance 0: {amount.isEqualTo(BigNumber("0")) ? "true" : "false"}</p> */}
      </div>
    </main>
  );
}
