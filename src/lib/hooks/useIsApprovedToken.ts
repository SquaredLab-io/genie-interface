import { useMemo } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import BigNumber from "bignumber.js";
import { WethABi } from "@lib/abis";
import { WagmiFetchBalanceResult } from "@lib/utils/getAccountBalance";

interface PropsType {
  input: number;
  tokenAddress: Address | undefined;
  poolAddress: Address | undefined;
  tokenBalance: WagmiFetchBalanceResult | undefined;
  paused?: boolean;
}

/**
 * Check if a token is approved.
 *
 * @param tokenAddress Address of the token
 * @param poolAddress Contract address of the poolAddress
 * @param tokenBalance Balance of the token
 * @param input Input value
 * @returns Object containing data, isLoading, isError, and isSuccess
 */
const useIsApprovedToken = ({
  input,
  tokenAddress,
  poolAddress,
  tokenBalance,
  paused = false
}: PropsType) => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useReadContract({
    abi: WethABi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address, poolAddress], // owner, spender
    query: {
      enabled: !!address && !!poolAddress && !paused
    }
  });

  const allowance = useMemo(
    () => BigNumber(data?.toString() ?? "0").decimalPlaces(0, 1),
    [data]
  );

  const check = useMemo(() => {
    if (tokenBalance?.decimals && input) {
      const inputAmount = BigNumber(input.toString())
        .multipliedBy(BigNumber(10).pow(tokenBalance.decimals))
        .decimalPlaces(0, 1);
      return inputAmount.isLessThanOrEqualTo(allowance);
    }
    return false;
  }, [tokenBalance, input, allowance]);

  return {
    isApprovedData: data,
    isApprovedLoading: isLoading,
    isApprovedError: isError,
    isApprovedSuccess: check
  };
};

export default useIsApprovedToken;
