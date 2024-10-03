"use client";

import { memo } from "react";
import { cn } from "@lib/utils";
import { Slider } from "@components/ui/slider";
import Stepper from "./stepper";

interface PropsType {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  indices?: number[];
  isPerc?: boolean;
  disabled?: boolean;
  className?: string;
  customStepper?: (index: number) => JSX.Element;
}

/**
 * This component creates a customizable slider with optional step indicators.
 * It wraps the base Slider component, adding functionality for step visualization and custom steppers.
 *
 * Features:
 * - Customizable min, max, and step values
 * - Optional indices for step visualization
 * - Support for custom stepper components
 * - Disabled state support
 * - Customizable styling through className prop
 *
 * @param value - Current selected value
 * @param setValue - Function to update the selected value
 * @param min - Minimum value of the slider
 * @param max - Maximum value of the slider
 * @param step - Step size for the slider (default: 1)
 * @param indices - Optional array of values to display as steps
 * @param disabled - Optional boolean to disable the slider
 * @param className - Optional CSS class name for styling
 * @param customStepper - Optional function to render custom stepper components
 */
const SliderBar = ({
  value,
  setValue,
  min,
  max,
  step = 1,
  indices,
  isPerc = false,
  disabled = false,
  className,
  customStepper
}: PropsType) => {
  return (
    <div className={cn("relative pb-6 z-0", className)}>
      <Slider
        defaultValue={[value]}
        value={value ? [value] : [0]}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        onValueChange={(e) => setValue(e[0])}
      />
      {indices && (
        <div className="absolute inline-flex justify-between -top-0.5 left-0 right-0 mx-auto w-full text-xs/[18px] text-[#757B80] -z-10">
          {indices.map((i) =>
            customStepper ? (
              customStepper(i)
            ) : (
              <Stepper
                key={i}
                sliderValue={i}
                isPerc={isPerc}
                sliderValues={indices}
                currentValue={value}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SliderBar);
