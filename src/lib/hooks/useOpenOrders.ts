import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";
import { PositionTab } from "@squaredlab-io/sdk/src";
import { useLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
}

interface ReturnType {
  openOrders: PositionTab | undefined;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

/**
 *
 * @param poolAddress
 * @param paused Pause the auto fetching
 * @returns openOrders, isFetching, refetch
 */
export function useOpenOrders({ poolAddress, paused = false }: PropsType): ReturnType {
  const [orders, setOrders] = useState<PositionTab>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { address } = useAccount();

  // using local-storage api for caching
  const [value, setValue] = useLocalStorage(`genie:open-order:${address}`, "");

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    try {
      setIsFetching(true);
      const openOrders = await potentia?.openOrders(poolAddress);
      if (openOrders) {
        setOrders(openOrders);
        setValue(JSON.stringify(openOrders));
      }
    } catch (error) {
      notification.error({
        title: "Failed to fetch Open Orders",
        description: "Please try again"
      });
      setIsError(true);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (potentia && !paused && poolAddress && address) {
      if (value !== "") {
        setOrders(JSON.parse(value));
      }
      refetch();
    }
  }, [potentia, value, address, poolAddress]);

  return {
    openOrders: orders,
    isFetching,
    refetch
  } satisfies ReturnType;
}
