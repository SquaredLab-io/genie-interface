import { useEffect } from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ReadContractErrorType } from "@wagmi/core";
import { Address, formatUnits } from "viem";
import { useReadContract, useAccount } from "wagmi";
import notification from "@components/common/notification";
import { WethABi } from "@lib/abis";
import { WagmiFetchBalanceResult } from "@lib/types/common";

interface ReturnType {
  data: WagmiFetchBalanceResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ReadContractErrorType | null;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
}

interface PropsType {
  token: Address | undefined;
  decimals: number | undefined;
  symbol: string | undefined;
}

/**
 * Let's use Wagmi's latest method to get Token a balance
 */
const useTokenBalance = ({ token, decimals, symbol }: PropsType): ReturnType => {
  const { address } = useAccount();
  const {
    data: balance,
    isLoading,
    isError,
    error,
    refetch
  } = useReadContract({
    abi: WethABi,
    address: token,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address && !!token,
      staleTime: 60000,
      refetchOnReconnect: true,
      retry: 3
    }
  });

  useEffect(() => {
    if (isError) {
      notification.error({
        id: "balance-error",
        title: "Failed to fetch user balance",
        description: "Please try again"
      });
    }
  }, [isError]);

  return {
    data: balance
      ? {
          value: BigInt(balance as string),
          decimals: decimals!,
          symbol: symbol!,
          formatted: formatUnits(BigInt(balance as string), decimals!)
        }
      : undefined,
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useTokenBalance;
