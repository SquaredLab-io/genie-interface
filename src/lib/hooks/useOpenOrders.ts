import { useAccount, useWalletClient } from "wagmi";
import { getAddress } from "viem";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { PositionTab } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import notification from "@components/common/notification";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
}

interface ReturnType {
  openOrders: PositionTab | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PositionTab | undefined, Error>>;
}

/**
 *
 * @param poolAddress
 * @param paused Pause the auto fetching
 * @returns openOrders, isFetching, getOpenOrders
 */
export function useOpenOrders({ poolAddress, paused = false }: PropsType): ReturnType {
  const { status } = useWalletClient();
  const { address } = useAccount();

  const { potentia } = usePotentiaSdk();

  const getOpenOrders = async () => {
    try {
      const oo = await potentia?.openOrders(getAddress(poolAddress));
      console.log("openorders from sdk", oo);
      return oo;
    } catch (error) {
      notification.error({
        title: "Failed to fetch Open Orders",
        description: `${error}`
      });
    }
  };

  const {
    data: orders,
    isFetching,
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ["openOrders"],
    queryFn: getOpenOrders,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!poolAddress && status === "success" && !!potentia && !!address
  });

  return {
    openOrders: orders,
    isFetching,
    refetch
  } satisfies ReturnType;
}
