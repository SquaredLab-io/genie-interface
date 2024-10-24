"use client";

import Image from "next/image";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { _getDecimalAdjusted } from "@lib/utils/formatting";
import BurnNftForm from "./burn-nft-form";
import { PoolInfo } from "@squaredlab-io/sdk";
import { getPoolTokens } from "@lib/utils/pools";
import { useMemo } from "react";

const BurnNft = ({ pool }: { pool: PoolInfo }) => {
  return (
    <div className="flex flex-col lg:flex-row mx-auto gap-10 lg:gap-6 w-full max-w-[1255px] h-full rounded-sm p-6 border border-secondary-gray">
      <div className="w-full lg:w-1/2 h-full relative aspect-[596/710]">
        <Image
          src="/images/pool-nft.png"
          alt="Potentia Pool NFT"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className="flex flex-col items-start gap-9 w-full lg:w-1/2">
        <Header _pool={pool} />
        <BurnNftForm />
        <Section title="Start Value" />
        <Section title="Current Value" />
      </div>
    </div>
  );
};

const Header = ({ _pool }: { _pool: PoolInfo }) => {
  const { pool, power } = _pool;
  const tokens = useMemo(() => getPoolTokens(pool), [pool]);
  return (
    <div className="whitespace-nowrap flex flex-row items-center gap-3 text-left font-medium max-w-fit">
      <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-3">
        {tokens.map((asset, index) => (
          <div
            key={`${asset}_${index}`}
            className="z-0 flex overflow-hidden ring-2 ring-white rounded-full bg-neutral-800"
          >
            <Image
              src={`/tokens/${asset.toLowerCase()}.svg`}
              alt={asset}
              width={42}
              height={42}
            />
          </div>
        ))}
      </div>
      <p className="font-bold text-[32px]/5 text-nowrap">
        {tokens[0]}
        <span className="text-genie-gray mx-2">/</span>
        {tokens[1]}
      </p>
      <p className="font-medium text-xs/3 bg-genie-blue pt-[4.5px] pb-[5.5px] px-3 rounded-md">
        p = {power}
      </p>
    </div>
  );
};

const Section = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-y-5 w-full">
      <h4 className="font-medium text-lg/7">{title}</h4>
      <div className="flex flex-col gap-y-3 font-medium text-[15px]/5">
        <div className="inline-flex justify-between">
          <p className="inline-flex items-center gap-x-[4.5px] text-[#94A3B8]">
            <Image src="/icons/LongIcon.svg" width={24} height={12} alt="Long" />
            Long
          </p>
          <span className="float-right">1</span>
        </div>
        <div className="inline-flex justify-between">
          <p className="inline-flex items-center gap-x-[4.5px] text-[#94A3B8]">
            <Image src="/icons/ShortIcon.svg" width={24} height={12} alt="Long" />
            Short
          </p>
          <span>2</span>
        </div>
        <div className="inline-flex justify-between">
          <p className="inline-flex items-center gap-x-[4.5px] text-[#94A3B8]">
            <Image src="/icons/PiIcon.svg" width={18} height={18} alt="Long" />
            Liquidity Pool
          </p>
          <span>1</span>
        </div>
        <div className="inline-flex justify-between">
          <p className="inline-flex items-center gap-x-[4.5px] text-[#94A3B8]">
            <Image src="/icons/EyeIcon.svg" width={19} height={14} alt="Long" />
            Total
          </p>
          <span>4</span>
        </div>
      </div>
    </div>
  );
};

export default BurnNft;
