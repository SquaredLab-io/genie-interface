"use client";

// Trade
import AddLiquidity from "./trade/AddLiquidity";
import RemoveLiquidity from "./trade/RemoveLiquidity";
// Charts
import { LpTradeOptions } from "@lib/types/enums";
import LpTradeSelector from "./lp-trade-selector";
import { Separator } from "@components/ui/separator";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useModalStore } from "@store/poolsStore";
import PoolHeader from "./pool-header";
import LPChart from "./lp-charts";
import PoolOverviewModal from "./pool-overview-modal";
import { useLpStore } from "@store/lpStore";

const PoolOverview = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const { lpTradeOption, setLpTradeOption } = useLpStore();
  const { openSelectPoolOverviewModal, setOpenSelectPoolOverviewModal } = useModalStore();

  const { pool, power } = overviewPool;
  const [token0, token1] = pool.split("/").map((p) => p.trim());

  return (
    <div className="overflow-auto pl-11 pt-11 h-full">
      {/* Header */}
      <PoolHeader assets={[token0, token1]} power={power} />
      {/* Graph and Add/Remove Liquidity Box */}
      <div className="grid grid-cols-7 mt-8 h-[calc(100vh-254px)]">
        <div className="col-span-5 border border-gray-800">
          <LPChart overviewPool={overviewPool} />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col px-4 border-y border-secondary-gray h-full">
            <header className="inline-flex items-center justify-between py-5">
              <h2 className="font-medium text-lg/6">
                {lpTradeOption === LpTradeOptions.supply
                  ? "Add Liquidity"
                  : "Remove Liquidity"}
              </h2>
              <LpTradeSelector lpTrade={lpTradeOption} setLpTrade={setLpTradeOption} />
            </header>
            <Separator className="mb-3" />
            {lpTradeOption === LpTradeOptions.supply ? (
              <AddLiquidity overviewPool={overviewPool} />
            ) : (
              <RemoveLiquidity overviewPool={overviewPool} />
            )}
          </div>
        </div>
      </div>
      <PoolOverviewModal
        open={openSelectPoolOverviewModal}
        setOpen={setOpenSelectPoolOverviewModal}
      />
    </div>
  );
};

export default PoolOverview;
