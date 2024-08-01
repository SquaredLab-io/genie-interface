import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { useAccount } from "wagmi";
import { Address, formatUnits } from "viem";
import { PositionType } from "@lib/types/enums";

/**
 * useCurrentPosition - A hook to fetch the current position of a user in the Potentia Protocol.
 *
 * @param {PositionType} isLong - Boolean for Long position
 * @returns Position data, isFetching, refetch method
 */
export function useCurrentPosition(isLong: PositionType, poolAddress: Address | undefined) {
  const [position, setPosition] = useState<string>("0");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();
  const { address } = useAccount();

  const refetch = async () => {
    try {
      setIsFetching(true);
      // console.log("getTokenBalance", {
      //   poolAddress,
      //   address,
      //   isLong
      // });
      const currPos = await potentia?.getTokenBalance(
        poolAddress!, // poolAddress
        address as `0x${string}`, // userAddress
        isLong // isLong
      );
      setPosition(currPos ?? "0");
    } catch (error) {
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (potentia && poolAddress) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia, address, poolAddress]);

  return {
    data: {
      value: position,
      formatted: parseFloat(formatUnits(BigInt(position), 18)).toFixed(3)
    },
    isFetching,
    refetch
  };
}
