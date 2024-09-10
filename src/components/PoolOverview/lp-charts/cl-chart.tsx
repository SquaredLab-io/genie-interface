"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import BigNumber from "bignumber.js";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { PoolInfo } from "@squaredlab-io/sdk";
import { Address } from "viem";
import LoadingLogo from "@components/icons/loading-logo";

const CL = {
  getCLChartData: (
    poolAddress: string,
    to: number,
    n: number,
    reserve: BigNumber,
    alpha: BigNumber,
    beta: BigNumber,
    k: BigNumber
  ) => {
    const poolAddr = poolAddress;
    const data = [];
    for (let i = 0; i < n; i++) {
      const x = (to / n) * i;
      const r = reserve.dividedBy(1e18).toNumber();
      const a = alpha.dividedBy(1e18).toNumber();
      const b = beta.dividedBy(1e18).toNumber();
      const K = k.dividedBy(1e18).toNumber();
      const phi = CL.longPayoff(x, r, a, K);
      const psi = CL.shortPayoff(x, r, b, K);
      console.log(phi, psi, phi + psi);

      data.push({
        x: x,
        longPayoff: phi,
        shortPayoff: psi,
        cl: r - phi - psi,
        reserve: r
      });
    }
    return data;
  },

  longCondition: (reserve: number, alpha: number, k: number) => {
    return (reserve / (2 * alpha)) ** (1 / k);
  },

  shortCondition: (reserve: number, beta: number, k: number) => {
    return ((2 * beta) / reserve) ** (1 / k);
  },

  longPayoff: (x: number, reserve: number, alpha: number, k: number) => {
    if (x <= CL.longCondition(reserve, alpha, k)) return alpha * x ** k;
    else {
      return reserve - reserve ** 2 / (4 * alpha * x ** k);
    }
  },

  shortPayoff: (x: number, reserve: number, beta: number, k: number) => {
    if (x >= CL.shortCondition(reserve, beta, k)) return beta * Math.pow(x, -k);
    else {
      return reserve - (reserve ** 2 * x ** k) / (4 * beta);
    }
  }
};

// Constants for Demo
const alpha = BigNumber(0.5e18);
const beta = BigNumber(0.5e18);
const k = BigNumber(3e18);
const reserve = BigNumber(3e18);

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
        const data = await potentia?.getCLChartData(
          overviewPool.poolAddr as Address // pool
          // to
          // n
        );
        console.log("data @getCLChartData", data);
        return data;
      } catch (error) {
        console.log("error while fetching clchart data", error);
      }
    },
    enabled: !!potentia && !!overviewPool
  });

  if (isFetching || !chartData) {
    return (
      <div className="size-full flex-col-center">
        <LoadingLogo size={80} />
      </div>
    );
  }

  return (
    <div className="w-full mt-5">
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              return value.toFixed(2);
            }}
          />
          <YAxis domain={[0, reserve.dividedBy(1e18).toNumber()]} tickCount={5} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

          <Line type="monotone" dataKey="longPayoff" stroke="violet" dot={false} />
          <Line type="monotone" dataKey="shortPayoff" stroke="pink" dot={false} />
          <Line
            type="monotone"
            dataKey="cl"
            stroke="skyblue"
            strokeWidth={3}
            dot={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
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
