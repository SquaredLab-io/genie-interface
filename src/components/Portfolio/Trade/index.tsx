"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import LongTrade from "./LongTrade";
import ShortTrade from "./ShortTrade";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { TradeOptions } from "@lib/types/enums";
import { useTradeStore } from "@store/tradeStore";

const tabsStyle =
  "w-1/2 py-[17px] text-center px-3 text-sm font-medium data-[state=active]:border data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text ";

const Trade = () => {
  const { potentia } = usePotentiaSdk();
  const { tradeType, setTradeType } = useTradeStore();

  return (
    <div className="flex flex-col border-b border-secondary-gray">
      {/* Long and Short Tabs and their content */}
      <Tabs value={tradeType} onValueChange={setTradeType} className="w-full">
        <TabsList className="w-full flex flex-row items-center font-semibold text-base border-b-[0.5px] border-[#303030]">
          <TabsTrigger
            value={TradeOptions.long}
            className={cn(
              "border-positive-green text-positive-green data-[state=active]:from-positive-green data-[state=active]:to-positive-green",
              tabsStyle
            )}
          >
            Long
          </TabsTrigger>
          <TabsTrigger
            value={TradeOptions.short}
            className={cn(
              "border-negative-red text-negative-red data-[state=active]:from-negative-red data-[state=active]:to-negative-red",
              tabsStyle
            )}
          >
            Short
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TradeOptions.long}>
          <LongTrade potentia={potentia} />
        </TabsContent>
        <TabsContent value={TradeOptions.short}>
          <ShortTrade potentia={potentia} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;
