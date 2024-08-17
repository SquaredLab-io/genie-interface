import { memo } from "react";
import Image from "next/image";
import { PopoverSizes } from "@lib/types/common";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { SUPPORTED_TOKENS } from "@lib/constants";
import Link from "next/link";

interface PoolsListProps {
  pools: PoolInfo[];
  updateSelectedPool: (value: PoolInfo) => void;
  noPools: boolean;
}

const PoolsList = ({ pools, updateSelectedPool, noPools }: PoolsListProps) => {
  console.log({
    pools,
    noPools
  });

  if (noPools) {
    return <div className="flex-row-center w-full h-20 opacity-50">No pools found</div>;
  }

  return (
    <div className="flex flex-col pt-4 px-4 pb-6">
      {pools.map((_pool) => {
        const { pool, underlying, power } = _pool;
        const name = SUPPORTED_TOKENS.find((t) => t.token === underlying)?.name;
        return (
          <Link href="/" key={underlying}>
            <button
              className="flex flex-row py-2 w-full justify-between items-center gap-2"
              onClick={() => {
                const selectedPool = pools.find((p) => p.poolAddr === _pool.poolAddr)!;
                // updateSelectedPool(selectedPool);
              }}
            >
              <div className="inline-flex items-center gap-4">
                <Image
                  src={`/tokens/${underlying.toLowerCase()}.svg`}
                  alt={`${underlying} token icon`}
                  width={38}
                  height={38}
                />
                <p className="flex flex-col items-start gap-1">
                  <span className="font-medium text-[15px]/[18px]">{name}</span>
                  <span className="font-medium text-[11px]/[14px] text-[#909090]">
                    {underlying}
                  </span>
                </p>
              </div>
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default memo(PoolsList);
