import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { useBalanceStore } from "@store/tradeStore";

export interface Token {
  address: string;
  balance: string;
}

export interface TokenBalances {
  lpToken: Token; // 0
  longToken: Token; // 1
  shortToken: Token; // 2
}

interface ReturnType {
  data: TokenBalances;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

/**
 * useCurrentPosition - A hook to fetch the current LP, Long and Short position of a user in the Potentia Protocol
 *
 * @returns Position data, isFetching, refetch method
 */
export function useCurrentPosition({
  poolAddress,
  paused = false
}: {
  poolAddress: Address | undefined;
  paused?: boolean
}): ReturnType {
  // const [position, setPosition] = useState<string | undefined>("");
  // const [isFetching, setIsFetching] = useState<boolean>(false);

  const {
    currentPosition,
    updateCurrentPosition,
    isFetchingPosition,
    updateFetchingPosition
  } = useBalanceStore();

  const { potentia } = usePotentiaSdk();
  const { address } = useAccount();

  const refetch = async () => {
    try {
      // setIsFetching(true);
      updateFetchingPosition(true);

      const currPos = await potentia?.poolRead.getTokenBalance(
        poolAddress as Address, // poolAddress
        address as Address // userAddress
      );

      if (currPos !== undefined) {
        console.log("updated currentPosition", currPos);
        // setPosition(currPos);
        updateCurrentPosition(currPos);
      }
    } catch (error) {
      console.error("Error while fetching positions");
      // setIsFetching(false);
      updateFetchingPosition(false);
    } finally {
      // setIsFetching(false);
      updateFetchingPosition(false);
    }
  };

  useEffect(() => {
    if (potentia && poolAddress && !paused) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia, address, poolAddress]);

  return {
    data: currentPosition!,
    isFetching: isFetchingPosition,
    refetch
  } satisfies ReturnType;
}
