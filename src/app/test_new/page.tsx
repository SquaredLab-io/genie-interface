"use client";

import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { useEffect, useState } from "react";
import toUnits, { toDollarUnits } from "@lib/utils/formatting";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { Button } from "@components/ui/button";
import notification from "@components/common/notification";
import { getAddress } from "viem";

export default function TestNew() {
  const isClient = useIsClient();
  const { isConnected, address } = useAccount();

  // const { potentia } = usePotentiaSdk();
  const { pools, isFetching } = usePools();
  const [isF, setIsF] = useState(false);
  const { selectedPool, updatePoolsData } = usePoolsStore();

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    try {
      setIsF(true);
      const longPos = await potentia?.ponderClient.getCurrentLongPositions(
        getAddress(selectedPool()?.poolAddr!),
        address!
      );

      console.log("longPositions @hook", longPos);
      // setOrders(openOrders);
      // console.log("fetched -- openorders\n", openOrders);
      // setValue(JSON.stringify(openOrders));
    } catch (error) {
      notification.error({
        title: "Failed to fetch long position",
        description: `${error}`
        // description: "Please try again"
      });
      // setIsError(true);
      setIsF(false);
    } finally {
      setIsF(false);
      console.log("poolAddress @testing", selectedPool()?.poolAddr, address);
    }
  };

  // updating the pool globally
  useEffect(() => {
    if (pools && pools.length > 0) {
      updatePoolsData(pools);
    }
  }, [pools]);

  // const { tokenPrices, isFetching: fetchingTokenPrices } = useTokenPrice({
  //   poolAddress: selectedPool()?.poolAddr
  // });

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
      <span>{isFetching && pools.length === 0 ? "fetching..." : "fetched"}</span>
      {<span>Selected Pool: {selectedPool()?.pool}</span>}
      {/* <span>{fetchingTokenPrices ? "token prices..." : ""}</span>
      <span>
        {" "}
        {tokenPrices
          ? `${toDollarUnits(parseFloat(tokenPrices.dollarVol), 3)}`
          : "token prices unavailable"}
      </span> */}
      <Button disabled={!isConnected || !selectedPool()} onClick={refetch}>
        Long position
      </Button>
      <span>{isF ? "fetching..." : "not fetching"}</span>
    </main>
  );
}
