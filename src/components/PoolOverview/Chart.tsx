import {
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  LineStyle
} from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";

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
      lineColor: "#FF7300",
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

      const newSeries = chart.addLineSeries({
        baseLineColor: colors.lineColor,
        baseLineStyle: LineStyle.Solid,
        baseLineWidth: 3
      });
      newSeries.setData(data);

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
