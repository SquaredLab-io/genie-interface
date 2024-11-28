import TradeButton from "./trade-buttons";
import { useState } from "react";
import TradeDrawerContainer from "./trade-drawer-container";

const TradeDrawerSection = () => {
  const [isTradeDrawer, setIsTradeDrawer] = useState(false);

  return (
    <div className="flex lg:hidden flex-row items-center gap-2 mb-4 w-full max-h-fit absolute bottom-4 px-3">
      <TradeButton
        variant={"long"}
        className="w-1/2 float-left"
        onClick={() => {
          setIsTradeDrawer(true);
        }}
      >
        Long
      </TradeButton>
      <TradeButton
        variant={"short"}
        className="w-1/2 float-right"
        onClick={() => {
          setIsTradeDrawer(true);
        }}
      >
        Short
      </TradeButton>
      {isTradeDrawer && (
        <TradeDrawerContainer open={isTradeDrawer} onOpenChange={setIsTradeDrawer} />
      )}
    </div>
  );
};

export default TradeDrawerSection;
