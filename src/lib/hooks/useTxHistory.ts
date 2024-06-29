import { Tx } from "@lib/types/portfolio";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { Address } from "viem";
import { CONTRACT_ADDRESSES } from "@lib/constants";

export function useTxHistory() {
  const [txHistory, setTxHistory] = useState<Tx[]>();
  const [isLoadingTxH, setIsLoadingTxH] = useState<boolean>(false);

  const { address } = useAccount();
  const { potentia } = usePotentiaSdk();

  useEffect(() => {
    if (address && potentia) {
      console.log("address available, calling getTxnHistory...");
      (async () => {
        try {
          setIsLoadingTxH(true);
          const result = await potentia?.getUserTxHistory(
            address as Address,
            CONTRACT_ADDRESSES.POTENTIA_POOL_ADDR
          );
          setTxHistory(result);
        } catch (error) {
          console.error("Error -- fetching transaction history", error);
        } finally {
          setIsLoadingTxH(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, potentia]);

  return { data: txHistory, isLoading: isLoadingTxH };
}
