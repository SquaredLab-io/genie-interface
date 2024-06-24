import { useEffect, useRef } from "react";
import {
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  LineStyle
} from "lightweight-charts";

const generateRandomData = (
  startDate: string,
  days: number,
  minValue: number,
  maxValue: number
) => {
  const data = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const value = (Math.random() * (maxValue - minValue) + minValue).toFixed(2);
    data.push({
      time: currentDate.toISOString().split("T")[0],
      value: parseFloat(value)
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const PoolChart = () => {
  const chartContainerRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 }
  ];

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
      width: chartContainerRef?.current.clientWidth,
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
      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth
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
      newSeries1.setData(newSeries1data);

      // Series 2
      const newSeries2 = chart.addLineSeries({
        color: colors.lineColorTwo,
        priceLineColor: colors.lineColorTwo,
        baseLineStyle: LineStyle.Solid,
        baseLineWidth: 3
      });
      const newSeries2data = generateRandomData("2018-12-01", 31, 10, 70);
      newSeries2.setData(newSeries2data);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [data]);

  return (
    <div
      className="size-full border-dotted border-t border-[#2A2C30]"
      ref={chartContainerRef}
    />
  );
};

export default PoolChart;
