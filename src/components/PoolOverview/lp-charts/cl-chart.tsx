"use client";

import {
  // ChartConfig,
  ChartContainer,
  // ChartLegend,
  // ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { PoolInfo } from "@squaredlab-io/sdk";
import { Address } from "viem";
import LoadingLogo from "@components/icons/loading-logo";
import { colors } from "./configs";

const chartConfig = {
  sin: {
    label: "sin(x)",
    color: "#fff"
  }
};

const CLChart = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const { potentia } = usePotentiaSdk();
  const { data: chartData, isFetching } = useQuery({
    queryKey: ["clChart", overviewPool.poolAddr],
    queryFn: async () => {
      try {
        return await potentia?.getCLChartData(
          overviewPool.poolAddr as Address // pool
        );
      } catch (error) {
        console.log("error while fetching clchart data", error);
      }
    },
    enabled: !!potentia && !!overviewPool
  });

  const reserve = Math.ceil(chartData?.reserve ?? 0);

  if (isFetching || !chartData) {
    return (
      <div className="size-full flex-col-center">
        <LoadingLogo size={80} />
      </div>
    );
  }

  return (
    <div className="mt-4 -mb-20 w-full h-[calc(100%-20px)]">
      <ChartContainer config={chartConfig} className="size-full">
        <LineChart
          accessibilityLayer
          data={chartData.chartData}
          margin={{
            left: 0,
            right: 0
          }}
        >
          <CartesianGrid
            vertical={true}
            stroke={colors.gridColor}
            color={colors.gridColor}
          />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              return value.toFixed(2);
            }}
          />
          <YAxis domain={[0, reserve]} tickCount={5} />

          <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />

          <Line
            type="monotone"
            dataKey="longPayoff"
            stroke="#0099FF"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="shortPayoff"
            stroke="#FF7300"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="cl"
            stroke="#604DA7"
            strokeWidth={3}
            dot={false}
          />
          {/* <ChartLegend content={<ChartLegendContent />} /> */}
          <Line
            type="monotone"
            dataKey="reserve"
            stroke="green"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default CLChart;
