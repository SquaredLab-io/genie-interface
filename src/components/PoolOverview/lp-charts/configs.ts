import { ChartOptions, ColorType, DeepPartial, LineStyle } from "lightweight-charts";
import { MutableRefObject } from "react";

// lp chart ranges
export const intervals = ["1m", "5m", "30m", "1h", "12h", "1d"];

export const colors = {
  backgroundColor: "#0C1820",
  lineColorOne: "#FF7300",
  lineColorTwo: "#0099FF",
  textColor: "white",
  barColor: "#0099FF",
  areaColor: "#1F323D",
  spinnerColor: "#01A1FF",
  gridColor: "#1F2D3F"
};

export const chartOptionsConfig = (
  chartContainerRef: MutableRefObject<null>
): DeepPartial<ChartOptions> => {
  const options: DeepPartial<ChartOptions> = {
    layout: {
      background: { type: ColorType.Solid, color: colors.backgroundColor },
      textColor: colors.textColor,
      attributionLogo: false
    },
    width: chartContainerRef.current
      ? (chartContainerRef.current as HTMLElement).clientWidth
      : undefined,
    height: chartContainerRef.current
      ? (chartContainerRef.current as HTMLElement).clientHeight
      : undefined,
    watermark: {
      visible: false
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0
      },
      borderVisible: false
    },
    autoSize: false, // Explicitly turn off autoSize
    grid: {
      vertLines: {
        color: colors.gridColor,
        style: LineStyle.Solid,
        visible: true
      },
      horzLines: {
        color: colors.gridColor,
        style: LineStyle.Solid,
        visible: true
      }
    },
    handleScale: {
      axisDoubleClickReset: true
    },
    handleScroll: {
      vertTouchDrag: false
    }
  };
  return options;
};

export type CLInfo = {
  x: number;
  longPayoff: number;
  shortPayoff: number;
  cl: number;
  reserve: number;
};
