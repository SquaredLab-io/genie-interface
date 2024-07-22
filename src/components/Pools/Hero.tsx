"use client";

import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="heading-gradient font-medium text-[32px] leading-9">Pools</h1>
      <h4 className="font-normal text-base/[22px] text-[#98B0C1]">
        Earn fees & rewards by deploying liquidity into Pools.
        <button className="inline-flex items-center gap-[6px] ml-1 text-[#00A3FF]">
          <span>How it works?</span>
          <ChevronDown size="14" />
        </button>
      </h4>
    </div>
  );
};

export default Hero;
