"use client";

import { useEffect, useRef, memo, MutableRefObject } from "react";
import {
  ConfigurationData,
  ExternalFeed,
  PotentiaSdk,
  getPotentiaDataFeed
} from "@squaredlab-io/sdk/src";
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
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
  const { selectedPool } = usePoolsStore();
  const { tradeType } = useTradeStore();

  // Chart Container and Widget Refs
  const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);

  useEffect(() => {
    async function initChart() {
      if (!potentia || !selectedPool()) return;

      const Datafeed: ExternalFeed = await getPotentiaDataFeed(
        potentia,
        ConfigurationData
      );
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
        disabled_features: [
          "use_localstorage_for_settings",
          "header_symbol_search",
          "symbol_search_hot_key",
          "symbol_info"
        ],
        enabled_features: ["study_templates"],
        charts_storage_url: widgetProps.charts_storage_url,
        charts_storage_api_version: widgetProps.charts_storage_api_version,
        client_id: widgetProps.client_id,
        user_id: widgetProps.user_id,
        fullscreen: widgetProps.fullscreen,
        autosize: widgetProps.autosize,
        theme: widgetProps.theme,
        debug: false,
        symbol_search_request_delay: widgetProps.symbol_search_request_delay,
        auto_save_delay: widgetProps.auto_save_delay,
        toolbar_bg: widgetProps.toolbar_bg,
        overrides: {
          "paneProperties.background": "#0C1820",
          "paneProperties.backgroundType": "solid"
        }
      };

      const tvWidget = new widget(widgetOptions);
      tvWidgetRef.current = tvWidget;

      tvWidget.onChartReady(() => {
        console.log("Chart is ready");
        injectCustomCSS(tvWidget);
      });

      // Cleanup function
      return () => {
        if (tvWidgetRef.current) {
          tvWidgetRef.current.remove();
          tvWidgetRef.current = null;
        }
      };
    }

    initChart();
  }, [widgetProps, selectedPool, tradeType, potentia]);

  function injectCustomCSS(tvWidget: IChartingLibraryWidget) {
    tvWidget.addCustomCSSFile(
      "data:text/css;base64," +
        btoa(`
          div[data-name="legend-source-title"] {
            pointer-events: none !important;
          }
          .centerElement-kfvcmk8t {
            display: none !important;
          }
        `)
    );
  }

  return <div ref={chartContainerRef} className="col-span-4" />;
};

export default memo(TradeChart);

/**
 * return <div ref={chartContainerRef} className="col-span-4 xl:col-span-3" />;
 */
