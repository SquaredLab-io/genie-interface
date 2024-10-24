import { memo } from "react";
import { cn } from "@lib/utils";

interface PropsType {
  sliderValue: number;
  isPerc: boolean;
  sliderValues: number[];
  currentValue: number;
}

const Stepper = ({ sliderValue, isPerc, sliderValues, currentValue }: PropsType) => {
  const isFirst = sliderValue === sliderValues[0];
  const isLast = sliderValue === sliderValues[sliderValues.length - 1];

  return (
    <p
      className={cn(
        isFirst ? "items-start" : isLast ? "items-end" : "items-center",
        "relative flex flex-col"
      )}
    >
      <span
        className={cn(
          "size-[6px] rounded-full",
          currentValue >= sliderValue ? "bg-primary-blue" : "bg-[#373C40]"
        )}
      />
      <span className="absolute top-3">
        {sliderValue}
        {isPerc && "%"}
      </span>
    </p>
  );
};

export default memo(Stepper);
