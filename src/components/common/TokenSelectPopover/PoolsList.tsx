import { PoolOptions } from "@lib/pools";
import { Pool } from "@lib/types/common";
import Image from "next/image";
import { memo } from "react";

interface PoolsListProps {
  pools: Pool[];
  noPools: boolean;
  updateSelectedPool: (value: PoolOptions) => void;
}

const PoolsList = ({ pools, noPools, updateSelectedPool }: PoolsListProps) => {
  if (noPools)
    return <div className="flex-row-center w-full h-20 opacity-50">No pools found</div>;
  return (
    <div className="flex flex-col mb-2">
      {pools.map((pool, index) => {
        const asset = pool.underlyingTokens[0];
        return (
          <button
            key={pool.symbol}
            className="flex flex-row px-4 py-2 w-full justify-between items-center gap-2 hover:bg-[#15212A] transition-colors duration-300"
            onClick={() => {
              if (index === 0) {
                updateSelectedPool(PoolOptions.weth);
              } else if (index === 1) {
                updateSelectedPool(PoolOptions.wbtc);
              } else if (index === 2) {
                updateSelectedPool(PoolOptions.usdc);
              }
            }}
          >
            <div className="inline-flex items-center gap-1">
              <div
                key={asset.address}
                className="z-0 flex overflow-hidden ring-0 rounded-full bg-secondary-gray"
              >
                <Image src={asset.icon} alt={asset.symbol} width={24} height={24} />
              </div>
              <p>
                {pool.underlyingTokens.map((asset, index) => (
                  <span key={asset.symbol}>
                    {asset.symbol}
                    {pool.underlyingTokens.length !== index + 1 && <span>-</span>}
                  </span>
                ))}
              </p>
            </div>
            <span className="font-medium text-2xs/[14px] rounded-sm py-px px-[4.5px] text-white bg-text-grad bg-gradient-blue">
              p = {pool.power}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default memo(PoolsList);
