import { useEffect, useState } from "react";
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

const useUnderlyingEstimateOut = ({
  poolAddress,
  amount,
  isLong,
  paused = false
}: PropsType) => {
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const estimatePositionUnderlyingOut = async () => {
    // console.log("estimatePositionUnderlyingOut args", {
    //   pool: poolAddress!,
    //   amount: amount!,
    //   isLong
    // });

    const _amount = (parseFloat(amount ?? "0") * 10 ** 18).toString();
    setIsFetching(true);

    try {
      const data = await potentia?.ponderClient.estimatePositionUnderlyingOut(
        poolAddress!,
        _amount,
        isLong
      );
      setOutput(data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.error("Failed to estimate underlying output");
      // notification.error({
      //   id: "error-output-underlying",
      //   title: "Failed to estimate underlying output"
      // });
    }
  };

  useEffect(() => {
    if (!paused && !!potentia && !!poolAddress && !!amount) {
      estimatePositionUnderlyingOut();
    }
  }, [amount]);

  return {
    output,
    isFetching
    // refetch:
  } satisfies ReturnType;
};

export default useUnderlyingEstimateOut;
