import React, { useEffect, useRef, useState, memo } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { PoolInfo } from "@squaredlab-io/sdk";
import { Address } from "viem";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import LoadingLogo from "@components/icons/loading-logo";
import { colors } from "./configs";

const CLChart = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const { potentia } = usePotentiaSdk();
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const { data: chartData, isFetching } = useQuery({
    queryKey: ["clChart", overviewPool.poolAddr],
    queryFn: async () => {
      try {
        return await potentia?.getCLChartData(overviewPool.poolAddr as Address);
      } catch (error) {
        console.error("error while fetching clchart data", error);
      }
    },
    enabled: !!potentia && !!overviewPool,
    staleTime: 5000,
    gcTime: 15000,
    retry: 4
  });

  useEffect(() => {
    if (!chartContainerRef.current || !chartData) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize();
      }
    };

    if (!chartRef.current) {
      chartRef.current = echarts.init(chartContainerRef.current);
      window.addEventListener("resize", handleResize);
    }

    setIsLoadingChart(true);

    const option: echarts.EChartsOption = {
      animation: false,
      grid: {
        left: "3%",
        right: "0%",
        top: "1%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "value",
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { show: true },
        splitLine: {
          show: true,
          lineStyle: {
            color: colors.gridColor,
            type: "solid"
          }
        }
      },
      yAxis: {
        type: "value",
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { show: true },
        splitLine: {
          show: true,
          lineStyle: {
            color: colors.gridColor,
            type: "solid"
          }
        }
      },
      series: [
        {
          name: "Long Payoff",
          type: "line",
          data: chartData.chartData.map((item) => [item.x, item.longPayoff]),
          color: colors.lineColorTwo,
          symbol: "none",
          lineStyle: { width: 2 }
        },
        {
          name: "Short Payoff",
          type: "line",
          data: chartData.chartData.map((item) => [item.x, item.shortPayoff]),
          color: colors.lineColorOne,
          symbol: "none",
          lineStyle: { width: 2 }
        },
        {
          name: "CL",
          type: "line",
          data: chartData.chartData.map((item) => [item.x, item.cl]),
          color: colors.lineColorThree,
          symbol: "none",
          lineStyle: { width: 2 }
        },
        {
          name: "Reserve",
          type: "line",
          data: chartData.chartData.map((item) => [item.x, item.reserve]),
          color: colors.lineColorFour,
          symbol: "none",
          lineStyle: { width: 2 }
        }
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        },
        formatter: (params: any) => {
          let result = `${params[0].axisValue.toFixed(3)}<br/>`;
          params.forEach((param: any) => {
            const value = param.value[1].toFixed(3);
            const color = param.color;
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${color}"></span>${param.seriesName}: ${value}<br/>`;
          });
          return result;
        }
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100
        }
      ]
    };

    chartRef.current.setOption(option);
    setIsLoadingChart(false);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [chartData]);

  if (isLoadingChart || isFetching) {
    return (
      <div className="relative h-[calc(100%-20px)]">
        <div className="size-full flex-col-center">
          <LoadingLogo size={80} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100%-20px)]">
      <div className="size-full" ref={chartContainerRef} />
    </div>
  );
};

export default memo(CLChart);
