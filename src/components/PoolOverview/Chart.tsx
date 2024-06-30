import { useEffect, useRef, useState } from "react";
import {
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  LineStyle
} from "lightweight-charts";
import { Timeseries, transformTimeseries } from "./helper";
import { generateRandomData } from "./helper";

const PoolChart = ({
  timeseries,
  isLoadingData
}: {
  timeseries: Timeseries[];
  isLoadingData: boolean;
}) => {
  const chartContainerRef = useRef(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const { array1, array2 } = transformTimeseries(timeseries);

  // A useEffect that creates the chart based on configuration on load
  useEffect(() => {
    const colors = {
      backgroundColor: "#16191F",
      lineColorOne: "#FF7300",
      lineColorTwo: "#0099FF",
      textColor: "white"
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

      // Series 1
      const newSeries1 = chart.addLineSeries({
        color: colors.lineColorOne,
        priceLineColor: colors.lineColorOne,
        baseLineStyle: LineStyle.Solid,
        baseLineWidth: 3
      });
      console.log("array1", array1);
      newSeries1.setData(array1);

      // Series 2
      const newSeries2 = chart.addLineSeries({
        color: colors.lineColorTwo,
        priceLineColor: colors.lineColorTwo,
        baseLineStyle: LineStyle.Solid,
        baseLineWidth: 3
      });
      console.log("array2", array2);
      newSeries2.setData(array2);

      window.addEventListener("resize", handleResize);

      setIsLoadingChart(false);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array1]);

  return (
    <>
      {isLoadingChart || isLoadingData ? (
        <p>preparing chart...</p>
      ) : (
        <div
          className="size-full border-dotted border-t border-[#2A2C30]"
          ref={chartContainerRef}
        />
      )}
    </>
  );
};

export default PoolChart;
