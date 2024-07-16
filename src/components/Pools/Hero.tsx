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

/*

<div className="flex flex-col md:flex-row gap-10 justify-between items-center border">
      <div className="flex flex-col gap-4 text-center md:text-left max-w-[523px]">
        <h1 className="font-normal text-4xl/10 md:text-5xl/[52.8px]">
          Shape the future with <span className="text-gradient-blue">powerful</span>{" "}
          derivatives.
        </h1>
        <p className="font-extralight text-xl text-[#B5B5B5]">
          Become a market maker and get rewarded! Contribute to the pool&apos;s activity
          and earn a cut of the trading fees. Plus, enjoy bonus incentives when programs
          are active!
        </p>
        <div className="inline-flex justify-center md:justify-start items-center gap-4 mt-8">
          <Button>Create Pools</Button>
          <Link href="/pool">
            <Button variant="outline">Add Liquidity</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-7 max-w-fit h-full">
        {pools_social.map((social, index) => (
          <a
            key={social.name}
            className="group h-11 w-11 flex items-center justify-center rounded-full border border-off-white hover:border-white transition-all hover:scale-105 active:scale-100"
            href={social.href}
            target="_blank"
            referrerPolicy="strict-origin"
          >
            <social.icon
              size={22}
              className="text-off-white group-hover:text-white transition-colors"
            />
          </a>
        ))}
      </div>
    </div>

 */
