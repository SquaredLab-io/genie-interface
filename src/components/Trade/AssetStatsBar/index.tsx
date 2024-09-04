"use client";

import { FC } from "react";
import TokenSelector from "./TokenSelector";
import PricesBar from "./PricesBar";
import { Separator } from "@components/ui/separator";
import { usePoolsStore } from "@store/poolsStore";

const AssetStatsBar: FC = () => {
  const { selectedPool } = usePoolsStore();
  return (
    <div className="flex flex-row items-center flex-auto w-full border-b border-secondary-gray">
      <TokenSelector selectedPool={selectedPool()} />
      <Separator orientation="vertical" />
      <PricesBar selectedPool={selectedPool()} />
    </div>
  );
};

export default AssetStatsBar;
