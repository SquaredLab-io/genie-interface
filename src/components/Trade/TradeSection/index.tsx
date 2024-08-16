"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import LongTrade from "./LongTrade";
import ShortTrade from "./ShortTrade";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { TradeOptions } from "@lib/types/enums";
import { useTradeStore } from "@store/tradeStore";

const tabsStyle =
  "w-1/2 py-2 text-center font-medium text-sm/5 data-[state=active]:border-t bg-[#121F27] data-[state=active]:bg-primary-gray";

const Trade = () => {
  const { potentia } = usePotentiaSdk();
  const { tradeType, setTradeType } = useTradeStore();

  return (
    <div className="flex flex-col border-b border-secondary-gray">
      {/* Long and Short Tabs and their content */}
      <Tabs value={tradeType} onValueChange={setTradeType} className="w-full">
        <TabsList className="w-full flex flex-row items-center font-semibold text-base">
          <TabsTrigger
            value={TradeOptions.long}
            className={cn(
              "border-[#07AD3B] text-[#07AD3B]",
              tabsStyle
            )}
          >
            Long
          </TabsTrigger>
          <TabsTrigger
            value={TradeOptions.short}
            className={cn(
              "border-[#FF3318] text-[#FF3318]",
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
