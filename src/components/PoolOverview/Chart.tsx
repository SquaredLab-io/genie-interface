import { useEffect, useRef, useState } from "react";
import {
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  LineStyle
} from "lightweight-charts";
import { Timeseries } from "./helper";
import { generateRandomData } from "./helper";

// Function to convert timestamp to yyyy-mm-dd format
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Function to remove duplicate dates and keep the last object for each date
const removeDuplicateDates = (data: { time: string; value: number }[]) => {
  const dateMap = new Map<string, { time: string; value: number }>();

  data.forEach((item) => {
    dateMap.set(item.time, item);
  });

  return Array.from(dateMap.values());
};

// Function to transform timeseries data
const transformTimeseries = (timeseries: Timeseries[]) => {
  console.log("timeseries", timeseries);

  const _array1 = timeseries?.map((item) => ({
    time: formatDate(item.timestamp),
    value: parseFloat(item.R)
  }));

  const _array2 = timeseries?.map((item) => ({
    time: formatDate(item.timestamp),
    value: parseFloat(item.CL)
  }));

  const array1 = removeDuplicateDates(_array1);
  const array2 = removeDuplicateDates(_array2);

  console.log("array1", array1);
  console.log("array2", array2);
  return { array1, array2 };
};

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
      const newSeries1data = generateRandomData("2018-12-01", 31, 20, 40);
      console.log("genData", newSeries1data);
      newSeries1.setData(array1);

      // Series 2
      const newSeries2 = chart.addLineSeries({
        color: colors.lineColorTwo,
        priceLineColor: colors.lineColorTwo,
        baseLineStyle: LineStyle.Solid,
        baseLineWidth: 3
      });
      const newSeries2data = generateRandomData("2018-12-01", 31, 10, 70);
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

  // useEffect(() => console.log("isloading", isLoadingChart), [isLoadingChart]);

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
