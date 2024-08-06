import { ChartOptions, ColorType, DeepPartial } from "lightweight-charts";
import { MutableRefObject } from "react";

export const colors = {
  backgroundColor: "#16191F",
  lineColorOne: "#FF7300",
  lineColorTwo: "#0099FF",
  textColor: "white",
  barColor: "#0099FF",
  areaColor: "#1F323D",
  spinnerColor: "#01A1FF"
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
        visible: false
      },
      horzLines: {
        visible: false
      }
    }
  };
  return options;
};
