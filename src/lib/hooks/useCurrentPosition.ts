import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";

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

const getParsedJson = (pos: string | undefined) => {
  if (pos) {
    try {
      const parsedJson = JSON.parse(pos);
      // console.log("parsedJson", parsedJson);
      return parsedJson;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      notification.error({
        title: `Failed to parse JSON: ${error}`
      });
      return {};
    }
  }
  return {};
};

/**
 * useCurrentPosition - A hook to fetch the current LP, Long and Short position of a user in the Potentia Protocol
 *
 * @returns Position data, isFetching, refetch method
 */
export function useCurrentPosition(poolAddress: Address | undefined): ReturnType {
  const [position, setPosition] = useState<string | undefined>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();
  const { address } = useAccount();

  const refetch = async () => {
    try {
      setIsFetching(true);

      const currPos = await potentia?.getTokenBalance(
        poolAddress as Address, // poolAddress
        address as Address // userAddress
      );
      setPosition(currPos);
    } catch (error) {
      // notification.error({
      //   title: "Error while fetching positions",
      //   description: "Please try again"
      // });
      console.error("Error while fetching positions");
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
    data: getParsedJson(position),
    isFetching,
    refetch
  } satisfies ReturnType;
}
