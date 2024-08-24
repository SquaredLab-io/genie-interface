import { useAccount } from "wagmi";
import { Address } from "viem";
import { useQuery, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { TokenBalance } from "@squaredlab-io/sdk";
import { usePotentiaSdk } from "./usePotentiaSdk";

interface ReturnType {
  data: TokenBalance | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<TokenBalance | undefined, Error>>;
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
  paused?: boolean;
}): ReturnType {
  const { potentia } = usePotentiaSdk();
  const { address } = useAccount();

  const getCurrentPosition = async (): Promise<TokenBalance | undefined> => {
    try {
      const currPos = await potentia?.getTokenBalance(
        poolAddress as Address, // poolAddress
        address as Address // userAddress
      );
      // const currentPos = await potentia?.ponderClient.getCurrentUserPositions(
      //   getAddress(poolAddress as string),
      //   address! as Address
      // );
      console.log("fetched current position", currentPos);
      return currPos;
    } catch (error) {
      console.error("Error while fetching positions");
    }
  };

  const { data, isFetching, refetch, isError, error } = useQuery({
    queryKey: ["currentPosition", poolAddress, address],
    queryFn: getCurrentPosition,
    refetchInterval: false,
    enabled: !!potentia && !!poolAddress && !paused && !!address
  });

  return {
    data,
    isFetching,
    refetch
  } satisfies ReturnType;
}
