import { useAccount, useWalletClient } from "wagmi";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { UserPointRank } from "@squaredlab-io/sdk/src/interfaces/ponder.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";

interface PropsType {
  paused?: boolean;
}

export interface UserPointsType {
  userPoints: UserPointRank | undefined;
  isFetching: boolean;
  isPending: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<UserPointRank | undefined, Error>>;
}

export function useUserPoints({ paused = false }: PropsType = {}): UserPointsType {
  const { address } = useAccount();
  const { status } = useWalletClient();
  const { potentia } = usePotentiaSdk();

  const getUserPoints = async () => {
    if (!address) return undefined;
    try {
      return await potentia?.ponderClient.getUserPoints(address);
    } catch (error) {
      console.error("Failed to fetch user points\n", error);
    }
  };

  const { data, isFetching, isPending, refetch, isError, error } = useQuery({
    queryKey: ["userPoints", address], // userpoints are only unique based on addresses
    queryFn: getUserPoints,
    refetchInterval: REFETCH_INTERVAL,
    enabled:
      !paused && potentia !== undefined && address !== undefined && status === "success",
    staleTime: 10000,
    gcTime: 30000,
    retry: 4,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  return {
    userPoints: data,
    isFetching,
    isPending,
    refetch
  } satisfies UserPointsType;
}
