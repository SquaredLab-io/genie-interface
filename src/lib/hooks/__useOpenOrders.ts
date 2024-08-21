import { useAccount, useWalletClient } from "wagmi";
import { getAddress } from "viem";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { PositionTab } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import notification from "@components/common/notification";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";
import { useEffect, useState } from "react";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
}

interface ReturnType {
  openOrders: PositionTab | undefined;
  isFetching: boolean;
  refetch: () => void;
}

/**
 *
 * @param poolAddress
 * @param paused Pause the auto fetching
 * @returns openOrders, isFetching, getOpenOrders
 */
export function useOpenOrders({ poolAddress, paused = false }: PropsType): ReturnType {
  // fetching states
  const [orders, setOrders] = useState<PositionTab | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // wallet info hooks
  const { address } = useAccount();
  const { status } = useWalletClient();
  // initiating sdk
  const { potentia } = usePotentiaSdk();

  const getOpenOrders = async () => {
    try {
      setIsFetching(true);
      const oo = await potentia?.openOrders(getAddress(poolAddress));
      console.log("openorders from sdk", oo);
      setOrders(oo);
      setIsFetching(false);
      // return oo;
    } catch (error) {
      setIsFetching(false);
      setIsError(true);
      // notification.error({
      //   title: "Failed to fetch Open Orders",
      //   description: `${error}`
      // });
    }
  };

  useEffect(() => {
    if (
      !paused &&
      !!poolAddress &&
      potentia !== undefined &&
      address !== undefined &&
      status === "success"
    ) {
      getOpenOrders();
    }
  }, [poolAddress, potentia, address, status]);

  return {
    openOrders: orders,
    isFetching,
    refetch: getOpenOrders
  } satisfies ReturnType;
}
