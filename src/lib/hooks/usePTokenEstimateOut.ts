import { useEffect, useState } from "react";
import _ from "lodash";
import { usePotentiaSdk } from "./usePotentiaSdk";
import notification from "@components/common/notification";

interface PropsType {
  poolAddress: `0x${string}` | undefined;
  amount: string | undefined;
  isLong: boolean;
  paused?: boolean;
}

interface ReturnType {
  output: string | undefined;
  isFetching: boolean;
}

const usePTokenEstimateOut = ({
  poolAddress,
  amount,
  isLong,
  paused = false
}: PropsType) => {
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const estimatePositionPTokenOut = _.debounce(
    async (poolAddr: `0x${string}`, amt: string, long: boolean) => {
      setIsFetching(true);
      try {
        const data = await potentia?.ponderClient.estimatePositionPTokenOut(
          poolAddr, // pool address
          amt, // underlying amount in bignumber
          long
        );
        setOutput(data);
        // setIsFetching(false);
      } catch (error) {
        // setIsFetching(false);
        console.error("Failed to estimate pToken output");
        notification.error({
          id: "error-output-pToken",
          title: "Failed to estimate pToken output"
        });
      } finally {
        setIsFetching(false);
      }
    },
    500
  );

  useEffect(() => {
    if (!paused && !!potentia && !!poolAddress && !!amount) {
      estimatePositionPTokenOut(poolAddress, amount, isLong);
    } else {
      console.log("Skipping estimate due to missing or paused data");
    }

    return () => {
      estimatePositionPTokenOut.cancel();
    };
  }, [amount, paused, potentia, poolAddress, isLong]);

  return {
    output,
    isFetching
    // refetch:
  } satisfies ReturnType;
};

export default usePTokenEstimateOut;
