import { useEffect, useState } from "react";
// import { useLocalStorage } from "usehooks-ts";
import { useAccount, useWalletClient } from "wagmi";
import { PositionTab } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import notification from "@components/common/notification";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { getAddress } from "viem";

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
  // const { address } = useAccount();
  const { status } = useWalletClient();

  // using local-storage api for caching
  // const [value, setValue] = useLocalStorage(`genie:open-order:${address}`, "");

  const { potentia } = usePotentiaSdk();

  const refetch = async () => {
    try {
      setIsFetching(true);
      const openOrders = await potentia?.openOrders(getAddress(poolAddress));
      if (openOrders) {
        console.log("openOrders @hook", openOrders);
        setOrders(openOrders);
        // console.log("fetched -- openorders\n", openOrders);
        // setValue(JSON.stringify(openOrders));
      }
    } catch (error) {
      notification.error({
        title: "Failed to fetch Open Orders",
        description: `${error}`
        // description: "Please try again"
      });
      setIsError(true);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
      console.log("poolAddress @OO", poolAddress);
    }
  };

  useEffect(() => {
    if (potentia && !paused && poolAddress && status === "success") {
      // if (value !== "") {
      //   setOrders(JSON.parse(value));
      // }
      refetch();
    }
  }, [potentia, status, poolAddress]);
  // }, [potentia, value, address, poolAddress]);

  return {
    openOrders: orders,
    isFetching,
    refetch
  } satisfies ReturnType;
}
