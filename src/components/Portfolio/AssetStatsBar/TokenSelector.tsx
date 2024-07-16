import Image from "next/image";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
// import { usePower } from "@lib/hooks/usePotentiaMethods";
import { Pool } from "@lib/types/common";

export default function TokenSelector({ selectedPool }: { selectedPool: Pool }) {
  // const { power, isLoading: isPowerLoading } = usePower(selectedPool.poolAddress);
  const asset = selectedPool.underlyingTokens[0];
  
  return (
    <TokenSelectPopover>
      <button className="group flex flex-row justify-normal items-center text-left py-3 px-5 gap-2">
        {/* Tokens Images */}
        <div className="z-0 flex overflow-hidden ring-1 ring-primary-gray rounded-full bg-neutral-800">
          <Image src={asset.icon} alt={asset.symbol} width={32} height={32} />
        </div>
        {/* Tokens Symbols */}
        <div className="inline-flex items-center gap-1">
          <span className="text-base/5 font-medium text-nowrap">
            {selectedPool.underlyingTokens.map((asset) => (
              <span key={asset.address}>{asset.symbol}</span>
            ))}
          </span>
          <span className="text-nowrap font-normal text-2xs/[14px] rounded-sm py-px px-[4.5px] text-white bg-text-grad bg-gradient-blue">
            {/* Fix this, get Power from SDK */}
            p = {selectedPool.power}
            {/* p = {isPowerLoading ? "..." : power ?? "NA"} */}
          </span>
        </div>
        {/* Drop Menu Icon */}
        <Image
          src="/icons/MenuDropIcon.svg"
          className="ml-2 opacity-80 group-hover:opacity-100 transition-opacity"
          width={20}
          height={20}
          alt="menu-icon"
        />
      </button>
    </TokenSelectPopover>
  );
}
