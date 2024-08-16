import { useEffect, useRef, useState } from "react";
import {
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  LineStyle
} from "lightweight-charts";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
// import { Timeseries, transformTimeseries } from "./helper";
// import { generateRandomData } from "./helper";
// import { useTradeStore } from "@store/tradeStore";
// import { transformTimeseries } from "./helper";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { chartOptionsConfig, colors } from "./configs";
import LoadingLogo from "@components/icons/loading-logo";

const CLChart = ({
  overviewPool
  // timeseries,
  // isLoadingData
}: {
  overviewPool: PoolInfo;
  // timeseries: Timeseries[];
  // isLoadingData: boolean;
}) => {
  const chartContainerRef = useRef(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // A useEffect that creates the chart based on configuration on load
  useEffect(() => {
    const currentArray = [
      [
        { time: "2024-06-25", value: 1.025029e22 },
        { time: "2024-06-26", value: 1.0258792135962638e22 },
        { time: "2024-06-27", value: 1.0427219776855823e22 },
        { time: "2024-06-28", value: 1.2370395241889999e22 },
        { time: "2024-06-29", value: 1.9781757635431865e22 },
        { time: "2024-06-30", value: 2.1989757635431865e22 },
        { time: "2024-07-01", value: 2.2775072652607286e22 }
      ],
      [
        { time: "2024-06-25", value: 3.040057229269585e21 },
        { time: "2024-06-26", value: 4.455764107665688e21 },
        { time: "2024-06-27", value: 4.6057965544191406e21 },
        { time: "2024-06-28", value: 5.655668197324321e21 },
        { time: "2024-06-29", value: 6.819685867340714e21 },
        { time: "2024-06-30", value: 8.247724085050428e21 },
        { time: "2024-07-01", value: 1.1093743659795758e22 }
      ]
    ];

    const chartOptions = chartOptionsConfig(chartContainerRef);

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
      newSeries1.setData(currentArray[0]);

      // Series 2
      const newSeries2 = chart.addLineSeries({
        color: colors.lineColorTwo,
        priceLineColor: colors.lineColorTwo,
        baseLineStyle: LineStyle.Solid,
        baseLineWidth: 3
      });
      newSeries2.setData(currentArray[1]);

      window.addEventListener("resize", handleResize);

      setIsLoadingChart(false);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingChart ? (
        <div className="size-full flex-col-center">
          <LoadingLogo size={80} />
        </div>
      ) : (
        <div className="h-[calc(100%-20px)]" ref={chartContainerRef} />
      )}
    </>
  );
};

export default CLChart;
