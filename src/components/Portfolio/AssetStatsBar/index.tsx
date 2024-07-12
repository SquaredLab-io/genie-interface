"use client";

import { FC } from "react";
import { useTradeStore } from "@store/tradeStore";
import TokenSelector from "./TokenSelector";
import PricesBar from "./PricesBar";
import { Separator } from "@components/ui/separator";

const AssetStatsBar: FC = () => {
  const { selectedPool } = useTradeStore();
  return (
    <div className="flex flex-row items-center w-full border-b border-secondary-gray">
      <TokenSelector selectedPool={selectedPool} />
      <Separator orientation="vertical" />
      <PricesBar selectedPool={selectedPool} />
    </div>
  );
};

export default AssetStatsBar;
