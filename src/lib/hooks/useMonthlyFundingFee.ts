import { Address, getAddress } from "viem";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { REFETCH_INTERVAL } from "@lib/constants";

type FundingFeeData = {
  feePerToken: number;
  feePercent: number;
};

type ReturnMonthlyFundingFee = {
  data: FundingFeeData | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<FundingFeeData | undefined, Error>>;
};

/**
 * useMonthlyFundingFee fetches the 30-day funding fee for the specified Pool
 * @param poolAddress The address of the pool to fetch funding fee for
 * @param paused Optional parameter to pause the query
 * @returns data, isFetching, refetch
 */
export function useMonthlyFundingFee(
  poolAddress: Address | undefined,
  paused = false
): ReturnMonthlyFundingFee {
  const { potentia } = usePotentiaSdk();

  async function getMonthlyFundingFee() {
    try {
      if (!poolAddress) {
        console.error("No pool address provided");
      }
      const result = await potentia?.ponderClient.get30DFunding(getAddress(poolAddress!));
      console.log("result @fundingFee", result);
      return result;
    } catch (error) {
      console.error("Error -- fetching monthly funding fee", error);
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["monthlyFundingFee", poolAddress],
    queryFn: getMonthlyFundingFee,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!poolAddress && !!potentia
    // staleTime: 0,
    // gcTime: 0
  });

  return { data, isFetching, refetch };
}
