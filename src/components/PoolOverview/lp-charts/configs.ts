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
      textColor: colors.textColor
    },
    width: (chartContainerRef.current as any)?.clientWidth,
    height: 417,
    autoSize: true,
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