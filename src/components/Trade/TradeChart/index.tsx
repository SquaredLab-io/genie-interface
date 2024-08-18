"use client";

import { useState, useEffect, useRef, memo, MutableRefObject } from "react";
import {
  ConfigurationData,
  ExternalFeed,
  PotentiaSdk,
  getPotentiaDataFeed
} from "@squaredlab-io/sdk/src";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget
} from "../../../../public/static/charting_library";
import { usePoolsStore } from "@store/poolsStore";
import { defaultWidgetProps as widgetProps } from "./defaultWidgetProps";
import { useTradeStore } from "@store/tradeStore";

interface PropsType {
  potentia: PotentiaSdk;
}

const TradeChart = ({ potentia }: PropsType) => {
  const [isChartReady, setIsChartReady] = useState(false);
  const { selectedPool } = usePoolsStore();
  const { tradeType } = useTradeStore();

  const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    async function fetchData() {
      if (!potentia && !selectedPool()) return;

      const Datafeed: ExternalFeed = await getPotentiaDataFeed(potentia, ConfigurationData);
      const tokenSymbol = `${selectedPool()?.underlying}^${selectedPool()?.power} ${tradeType.toUpperCase()}`;

      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: tokenSymbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: Datafeed,
        timezone: widgetProps.timezone,
        interval: widgetProps.interval as ResolutionString,
        container: chartContainerRef.current,
        library_path: widgetProps.library_path,
        locale: widgetProps.locale as LanguageCode,
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: widgetProps.charts_storage_url,
        charts_storage_api_version: widgetProps.charts_storage_api_version,
        client_id: widgetProps.client_id,
        user_id: widgetProps.user_id,
        fullscreen: widgetProps.fullscreen,
        autosize: widgetProps.autosize,
        theme: widgetProps.theme,
        debug: false,
        // favorites: {
        //   intervals: ["1S", "1", "1D"] as ResolutionString[],
        //   chartTypes: ["Area", "Candles"]
        // },
        symbol_search_request_delay: widgetProps.symbol_search_request_delay,
        auto_save_delay: widgetProps.auto_save_delay,
        toolbar_bg: widgetProps.toolbar_bg
        // time_frames: props.time_frames
        // time_scale: {
        //   min_bar_spacing: 10
        // }
      };

      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        setIsChartReady(true);
        // tvWidget.headerReady().then(() => {});
      });

      return () => {
        tvWidget.remove();
      };
    }
    fetchData();
  }, [widgetProps, selectedPool, tradeType, potentia]);
  // TODO: check here is chart is not updating on pool change

  return <div ref={chartContainerRef} className="col-span-4 xl:col-span-3" />;
};

export default memo(TradeChart);
