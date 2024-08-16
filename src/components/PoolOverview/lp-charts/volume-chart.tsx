import { memo, useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { DailyInfo } from "@squaredlab-io/sdk/src/subgraph";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { getVolumeTimeseries } from "../helper";
import { chartOptionsConfig, colors } from "./configs";
import LoadingLogo from "@components/icons/loading-logo";

const VolumeChart = ({
  dailyData,
  loading
}: {
  dailyData: DailyInfo[] | undefined;
  loading: boolean;
}) => {
  const chartContainerRef = useRef(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // Reversed as we need series in ascending order
  const timeseries = getVolumeTimeseries(dailyData);

  console.log("timeseries in volume", timeseries);

  // A useEffect that creates the chart based on configuration on load
  useEffect(() => {
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

      const series = chart.addHistogramSeries({
        color: colors.barColor
      });
      series.setData(timeseries);

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
          {/* <SpinnerIcon stroke={colors.spinnerColor} />
          <span>preparing chart...</span> */}
          <LoadingLogo size={80} />
        </div>
      ) : (
        <div className="h-[calc(100%-20px)]" ref={chartContainerRef} />
      )}
    </>
  );
};

export default memo(VolumeChart);
