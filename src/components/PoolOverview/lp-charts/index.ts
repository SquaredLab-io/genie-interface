import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import CLChart from "./counterpart-chart";
import TVLChart from "./tvl-chart";
import VolumeChart from "./volume-chart";

/**
 * LPChart is an object that return Chart components required for LP Overview
 */
const LPChart = {
  Counterpart: CLChart,
  TVL: TVLChart,
  Vol: VolumeChart
};

export default LPChart;
