"use client";

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget
} from "../../../../public/static/charting_library";

interface isReadyProps {
  setIsChartReady: Dispatch<SetStateAction<boolean>>;
}

const TradeChart = (props: Partial<ChartingLibraryWidgetOptions>) => {
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => console.log("IsChart Ready!", isChartReady), [isChartReady]);

  const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        "https://demo_feed.tradingview.com",
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: "latestFirst"
        }
      ),
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
      symbol_search_request_delay: props.symbol_search_request_delay,
      auto_save_delay: props.auto_save_delay,
      toolbar_bg: "#16191F",
      time_frames: props.time_frames
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      setIsChartReady(true);
      // tvWidget.changeTheme("dark");
      tvWidget.headerReady().then(() => {});
    });

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return (
    <div
      ref={chartContainerRef}
      className="flex flex-col items-center h-full max-h-max justify-center"
    />
  );
};

export default TradeChart;
