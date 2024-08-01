"use client";

import { MutableRefObject, useEffect, useRef, useState, memo } from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget
} from "../../../../public/static/charting_library";
import Datafeed from "@lib/datafeed";
import { usePoolsStore } from "@store/poolsStore";

const TradeChart = (props: Partial<ChartingLibraryWidgetOptions>) => {
  const [isChartReady, setIsChartReady] = useState(false);
  const { selectedPool } = usePoolsStore();

  const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: `Kraken:${selectedPool()?.underlying}`,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: Datafeed,
      timezone: props.timezone,
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: props.theme,
      debug: false,
      favorites: {
        intervals: ["1S", "1", "1D"] as ResolutionString[],
        chartTypes: ["Area", "Candles"]
      },
      symbol_search_request_delay: props.symbol_search_request_delay,
      auto_save_delay: props.auto_save_delay,
      toolbar_bg: props.toolbar_bg,
      time_frames: props.time_frames
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      setIsChartReady(true);
      // tvWidget.headerReady().then(() => {});
    });

    return () => {
      tvWidget.remove();
    };
  }, [props, selectedPool]);

  return <div ref={chartContainerRef} className="col-span-4 xl:col-span-3" />;
};

export default memo(TradeChart);
