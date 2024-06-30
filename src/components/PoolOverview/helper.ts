export enum GraphOptions {
  volume = "volume",
  tvl = "tvl",
  crossbook = "crossbook",
  counterpart = "counterpart"
}

export enum TradeOptions {
  add = "add",
  remove = "remove"
}

// To be removed
export const generateRandomData = (
  startDate: string,
  days: number,
  minValue: number,
  maxValue: number
) => {
  const data = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const value = (Math.random() * (maxValue - minValue) + minValue).toFixed(2);
    data.push({
      time: currentDate.toISOString().split("T")[0],
      value: parseFloat(value)
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  console.log("data for chart", data);

  return data;
};

export type Timeseries = {
  CL: string;
  R: string;
  pool: string;
  timestamp: number;
};
