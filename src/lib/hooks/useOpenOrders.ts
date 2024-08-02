import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";
import { PositionTab } from "@squaredlab-io/sdk/src";

interface ReturnType {
  openOrders: PositionTab | undefined;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export function useOpenOrders(poolAddress: string, paused = false) {
  const [orders, setOrders] = useState<PositionTab>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    try {
      setIsFetching(true);
      const openOrders = await potentia?.openOrders(poolAddress);
      console.log("openOrders", openOrders);
      setOrders(openOrders);
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
    if (potentia && !paused) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia]);

  return {
    openOrders: orders,
    isFetching,
    refetch
  } satisfies ReturnType;
}
