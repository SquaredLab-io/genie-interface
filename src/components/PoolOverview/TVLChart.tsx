import { useEffect, useRef, useState } from "react";
import { ChartOptions, ColorType, createChart, DeepPartial } from "lightweight-charts";
import { PoolInfo } from "@squaredlab-io/sdk/src";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { DailyInfo } from "@squaredlab-io/sdk/src/subgraph";
import { getTvlTimeseries } from "./helper";

const TVLChart = ({
  overviewPool,
  dailyData,
  loading
}: {
  overviewPool: PoolInfo;
  dailyData: DailyInfo[] | undefined;
  loading: boolean;
}) => {
  const chartContainerRef = useRef(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // Reversed as we need series in ascending order
  const timeseries = getTvlTimeseries(dailyData);

  console.log("timeseries in volume", timeseries);

  // A useEffect that creates the chart based on configuration on load
  useEffect(() => {
    const colors = {
      backgroundColor: "#16191F",
      lineColorOne: "#FF7300",
      lineColorTwo: "#0099FF",
      textColor: "white",
      barColor: "#0099FF"
      // areaTopColor: "#2962FF",
      // areaBottomColor: "rgba(41, 98, 255, 0.28)"
    };

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor
      },
      width: (chartContainerRef.current as any)?.clientWidth,
      height: 417,
      autoSize: true,
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          visible: false
        }
      }
    };

    if (chartContainerRef.current !== null) {
      // chart prep start
      setIsLoadingChart(true);

      const handleResize = () => {
        chart.applyOptions({
          width: (chartContainerRef.current as any)?.clientWidth
        });
      };

      const chart = createChart(chartContainerRef.current, chartOptions);

      chart.timeScale().fitContent();

      const series = chart.addAreaSeries({
        lineColor: "#0099FF",
        topColor: "#1F323D",
        bottomColor: "#1F323D"
      });
      series.setData(timeseries);

      // Series 1
      // const newSeries1 = chart.addBarSeries({
      //   upColor: colors.barColor,
      //   priceLineColor: colors.lineColorOne,
      //   baseLineStyle: LineStyle.Solid,
      //   baseLineWidth: 3
      // });
      // console.log("array1", currentArray[0]);
      // newSeries1.setData(timeseries);

      // // Series 2
      // const newSeries2 = chart.addLineSeries({
      //   color: colors.lineColorTwo,
      //   priceLineColor: colors.lineColorTwo,
      //   baseLineStyle: LineStyle.Solid,
      //   baseLineWidth: 3
      // });
      // newSeries2.setData(currentArray[1]);

      window.addEventListener("resize", handleResize);

      setIsLoadingChart(false);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeseries]);

  return (
    <>
      {isLoadingChart || loading ? (
        <div className="size-full flex-col-center">
          <SpinnerIcon stroke="#01A1FF" />
          <span>preparing chart...</span>
        </div>
      ) : (
        <div className="h-[calc(100%-20px)]" ref={chartContainerRef} />
      )}
    </>
  );
};

export default TVLChart;
