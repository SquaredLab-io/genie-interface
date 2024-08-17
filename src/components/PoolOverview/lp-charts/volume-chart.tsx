import { memo, useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { DailyInfo } from "@squaredlab-io/sdk/src/subgraph";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";
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

  const intervals = ["1m", "5m", "30m", "1h", "12h", "1d"];

  return (
    <div className="relative h-[calc(100%-20px)]">
      {isLoadingChart || loading ? (
        <div className="size-full flex-col-center">
          <LoadingLogo size={80} />
        </div>
      ) : (
        <div className="h-full" ref={chartContainerRef} />
      )}
      {/* Range Toggle Group */}
      {/* <div className="absolute -top-8 right-[120px] inline-flex items-center gap-x-3 max-w-fit font-normal text-sm/[22px]">
        {intervals.map((interval) => (
          <button
            key={interval}
            className="text-white opacity-80 hover:opacity-100 transition-colors duration-200"
          >
            {interval.toLowerCase()}
          </button>
        ))}
      </div> */}
      <ToggleGroup
        className="absolute -top-9 right-[120px]"
        type="single"
        defaultValue={intervals[intervals.length - 1]}
      >
        {intervals.map((interval) => (
          <ToggleGroupItem
            value={interval}
            key={interval}
            size="default"
            disabled={interval !== "1d"}
          >
            {interval}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default memo(VolumeChart);
