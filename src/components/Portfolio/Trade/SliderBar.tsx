"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { Slider } from "@components/ui/slider";
import { cn } from "@lib/utils";

interface PropsType {
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

/**
 *
 * @param value The controlled value of the slider.
 * @param setValue Method to update the value.
 * @param min The minimum value for the range.
 * @param max The maximum value for the range.
 * @param step* The stepping interval.
 * @param className*
 */
const SliderBar = ({ value, setValue, min, max, step = 1, className }: PropsType) => {
  const Stepper = ({ index }: { index: number }) => {
    // If index is either minima or maxima
    // if (index === 0 || index === max)
    //   return (
    //     <p className="mt-3 text-white">
    //       <span>{index}%</span>
    //     </p>
    //   );
    return (
      <p
        className={cn(
          index === 0 ? "items-start" : index === max ? "items-end" : "items-center",
          "flex flex-col gap-[6px]"
        )}
      >
        <span
          className={cn(
            "size-[6px] rounded-full",
            value[0] >= index ? "bg-primary-blue" : "bg-[#373C40]"
          )}
        />
        <span>{index}%</span>
      </p>
    );
  };

  return (
    <div className={cn("relative pb-6 z-0", className)}>
      <Slider
        defaultValue={value}
        value={value[0] ? value : [0]}
        min={min}
        max={max}
        step={step}
        onValueChange={(e) => setValue(e)}
      />
      <div className="absolute inline-flex justify-between -top-0.5 left-0 right-0 mx-auto w-full text-xs/[18px] text-[#757B80] -z-10">
        <Stepper index={0} />
        <Stepper index={25} />
        <Stepper index={50} />
        <Stepper index={75} />
        <Stepper index={100} />
      </div>
    </div>
  );
};

export default SliderBar;
