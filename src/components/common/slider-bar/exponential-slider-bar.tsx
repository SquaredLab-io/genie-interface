import { FC, memo, useCallback, useMemo } from "react";
import SliderBar from ".";
import Stepper from "./stepper";

interface PropsType {
  value: number;
  setValue: (value: number) => void;
  indices: number[];
  disabled?: boolean;
  className?: string;
}

/**
 * This component creates a slider with non-linear (exponential) scale values.
 * It wraps the base SliderBar component, providing exponential value mapping.
 *
 * Features:
 * - Displays custom values (e.g., [2, 4, 8, 16, 32]) on a linear slider
 * - Converts between linear slider positions and exponential values
 * - Uses custom Stepper components for each slider value
 * - Memoized functions for optimized performance
 *
 * @param value - Current selected value (in exponential scale)
 * @param setValue - Function to update the selected value
 * @param sliderValues - Array of values to be displayed on the slider (e.g., [2, 4, 8, 16, 32])
 * @param disabled - Optional boolean to disable the slider
 * @param className - Optional CSS class name for styling
 */
const ExponentialSliderBar: FC<PropsType> = ({
  value,
  setValue,
  indices,
  disabled = false,
  className
}) => {
  const min = 0;
  const max = useMemo(() => indices.length - 1, [indices]);

  // Convert exponential value to linear index
  const valueToLinear = useMemo(() => {
    return (val: number) => indices.indexOf(val);
  }, [indices]);

  // Convert linear index to exponential value
  const linearToValue = useMemo(() => {
    return (linear: number) => indices[linear];
  }, [indices]);

  // Handle slider value change, converting linear to exponential
  const handleChange = useCallback(
    (linearValue: number) => {
      setValue(linearToValue(linearValue));
    },
    [linearToValue, setValue]
  );

  // Create custom Stepper component for each index
  const customStepperComponent = useCallback(
    (index: number) => (
      <Stepper
        key={index}
        sliderValue={index}
        isPerc={false}
        sliderValues={indices}
        currentValue={value}
      />
    ),
    [value]
  );

  return (
    <SliderBar
      value={valueToLinear(value)}
      setValue={handleChange}
      min={min}
      max={max}
      step={1}
      indices={indices}
      disabled={disabled}
      className={className}
      customStepper={customStepperComponent}
    />
  );
};

export default memo(ExponentialSliderBar);
