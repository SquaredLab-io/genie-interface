"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Slider } from "@components/ui/slider";
import { cn } from "@lib/utils";

interface PropsType {
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
}

const TokenSlider = ({ value, setValue }: PropsType) => {
  return (
    <Slider
      defaultValue={value}
      value={value[0] ? value : [0]}
      max={100}
      step={1}
      onValueChange={(e) => setValue(e)}
    />
  );
};

export default TokenSlider;
