import { cn } from "@lib/utils";
import { GraphOptions } from "../helper";
import CLChart from "./counterpart-chart";
import TVLChart from "./tvl-chart";
import VolumeChart from "./volume-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { PoolInfo } from "@squaredlab-io/sdk";
import { useDailyData } from "@lib/hooks/useDailyData";
import { Address } from "viem";

const LPChart = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const { dailyData, isFetching: isFetchingDailyData } = useDailyData({
    poolAddress: overviewPool?.poolAddr as Address
  });

  const graphTabStyle = cn(
    "p-2 rounded-none bg-primary-gray", // base state
    "data-[state=active]:bg-white data-[state=active]:text-black" // active state
  );

  return (
    <Tabs defaultValue={GraphOptions.volume} className="size-full">
      <TabsList className="inline-flex justify-start font-medium text-sm/6 w-full">
        <TabsTrigger value={GraphOptions.volume} className={graphTabStyle}>
          Volume
        </TabsTrigger>
        <TabsTrigger value={GraphOptions.tvl} className={graphTabStyle}>
          TVL
        </TabsTrigger>
        {/* <TabsTrigger value={GraphOptions.crossbook} className={graphTabStyle}>
        Cross Book
      </TabsTrigger> */}
        <TabsTrigger value={GraphOptions.counterpart} className={graphTabStyle}>
          Counterpart Liquidity
        </TabsTrigger>
      </TabsList>
      <TabsContent value={GraphOptions.volume} className="h-[calc(100%-36px)]">
        <VolumeChart dailyData={dailyData} loading={isFetchingDailyData} />
      </TabsContent>
      <TabsContent value={GraphOptions.tvl} className="h-[calc(100%-36px)]">
        <TVLChart dailyData={dailyData} loading={isFetchingDailyData} />
      </TabsContent>
      {/* <TabsContent value={GraphOptions.crossbook}>Cross Book</TabsContent> */}
      <TabsContent value={GraphOptions.counterpart} className="h-[calc(100%-36px)]">
        <CLChart overviewPool={overviewPool} />
      </TabsContent>
    </Tabs>
  );
};

export default LPChart;
