import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import LongTrade from "./LongTrade";
import ShortTrade from "./ShortTrade";

enum TradeOptions {
  long = "long",
  short = "short"
}

const Trade = () => {
  return (
    <div className="flex flex-col bg-primary-gray">
      <Tabs defaultValue={TradeOptions.long} className="w-full">
        <TabsList className="w-full flex flex-row items-center font-sans-manrope font-semibold text-base border-b-[0.5px] border-[#303030]">
          <TabsTrigger
            value={TradeOptions.long}
            className={cn(
              "w-1/2 py-[18px] text-center rounded-r-[3px]",
              "data-[state=active]:border border-[#0099FF] data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-[#0099FF] data-[state=active]:to-[#00CCFF]"
            )}
          >
            <span className="bg-gradient-to-r text-transparent bg-clip-text from-[#0099FF] to-[#00CCFF]">
              Long
            </span>
          </TabsTrigger>
          <TabsTrigger
            value={TradeOptions.short}
            className={cn(
              "w-1/2 py-[18px] text-center rounded-l-[3px]",
              "data-[state=active]:border border-[#0099FF] data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-[#0099FF] data-[state=active]:to-[#00CCFF]"
            )}
          >
            Short
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TradeOptions.long}>
          <LongTrade />
        </TabsContent>
        <TabsContent value={TradeOptions.short}>
          <ShortTrade />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;
