"use client";

import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { Tx } from "@lib/types/portfolio";
import { useTradeStore } from "@store/tradeStore";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

export default function TestNew() {
  const { isMounted } = useIsMounted();
  const { address } = useAccount();
  const { selectedPool } = useTradeStore((state) => state);
  const { potentia } = usePotentiaSdk();

  const [isLoadingTxH, setIsLoadingTxH] = useState<boolean>(false);


  async function refetch() {
    try {
      console.log("testing _txHistory...", {
        userAddress: address,
        poolAddress: selectedPool.poolAddress
      });
      setIsLoadingTxH(true);
      const result = await potentia?.getUserTxHistory(
        address as Address,
        selectedPool.poolAddress
      );
      console.log("txHistory", result);
      // setTxHistory(result);
    } catch (error) {
      console.error("Error -- fetching transaction history", error);
    } finally {
      setIsLoadingTxH(false);
    }
  }

  useEffect(() => {
    if (address && potentia) {
      console.log('refetching...');
      refetch();
    } else {
      console.log('preparing...');
    }
  }, [potentia, address]);

  if (!isMounted) {
    return <></>;
  }

  return (
    <div>
      <p>{!address && "Connect wallet first!"}</p>
      <p>{isLoadingTxH ? "fetching..." : "not fetching."}</p>
    </div>
  );
}
