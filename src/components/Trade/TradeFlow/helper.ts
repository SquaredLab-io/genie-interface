import { TradeflowLayout } from "@lib/types/enums";

export function getTradeflowData(layout: TradeflowLayout, data: TradeflowDataType[]) {
  switch (layout) {
    case TradeflowLayout.all:
      return data;
    case TradeflowLayout.positive:
      return data.filter((d, i) => {
        if (i == 0) return true;
        else d.amount > data[i - 1].amount;
      });
    case TradeflowLayout.negative:
      return data.filter((d, i) => {
        if (i == 0) return true;
        else d.amount < data[i - 1].amount;
      });
  }
}

export type TradeflowDataType = {
  price: number;
  amount: number;
  total: number;
};

export const tradeFlowData = [
  {
    price: 3311.16,
    amount: 2.324246,
    total: 2342344.46
  },
  {
    price: 3313.32,
    amount: 2.287794,
    total: 2339053.66
  },
  {
    price: 3308.93,
    amount: 2.304308,
    total: 2334680.76
  },
  {
    price: 3311.52,
    amount: 2.318,
    total: 2337545.44
  },
  {
    price: 3309.72,
    amount: 2.314522,
    total: 2340525.03
  },
  {
    price: 3306.94,
    amount: 2.355508,
    total: 2341823.24
  },
  {
    price: 3302.4,
    amount: 2.327211,
    total: 2336823.3
  },
  {
    price: 3297.86,
    amount: 2.304909,
    total: 2336435.18
  },
  {
    price: 3301.09,
    amount: 2.329125,
    total: 2339176.52
  },
  {
    price: 3304.36,
    amount: 2.329403,
    total: 2336375.13
  },
  {
    price: 3302.22,
    amount: 2.338429,
    total: 2338493.95
  },
  {
    price: 3301.68,
    amount: 2.319251,
    total: 2337126.76
  },
  {
    price: 3297.44,
    amount: 2.331044,
    total: 2335465.38
  },
  {
    price: 3295.46,
    amount: 2.294118,
    total: 2333232.51
  },
  {
    price: 3294.01,
    amount: 2.306982,
    total: 2334164.09
  },
  {
    price: 3296.28,
    amount: 2.2577,
    total: 2336921.17
  },
  {
    price: 3294.01,
    amount: 2.304503,
    total: 2338540.78
  },
  {
    price: 3298.1,
    amount: 2.337285,
    total: 2343202.57
  },
  {
    price: 3300.2,
    amount: 2.324378,
    total: 2346711.78
  },
  {
    price: 3298.48,
    amount: 2.307727,
    total: 2349417.35
  },
  {
    price: 3300.69,
    amount: 2.27387,
    total: 2353420.28
  },
  {
    price: 3297.36,
    amount: 2.292127,
    total: 2355724.85
  },
  {
    price: 3295.47,
    amount: 2.260482,
    total: 2355305.34
  },
  {
    price: 3298.5,
    amount: 2.295197,
    total: 2351458.81
  },
  {
    price: 3299.87,
    amount: 2.336777,
    total: 2347766.21
  },
  {
    price: 3301.39,
    amount: 2.317424,
    total: 2351252.23
  },
  {
    price: 3299.57,
    amount: 2.278479,
    total: 2346963.1
  },
  {
    price: 3303.35,
    amount: 2.266992,
    total: 2342930.16
  },
  {
    price: 3304.46,
    amount: 2.249981,
    total: 2341438.32
  },
  {
    price: 3305.86,
    amount: 2.216165,
    total: 2338392.58
  },
  {
    price: 3304.42,
    amount: 2.170422,
    total: 2340146.76
  },
  {
    price: 3306.85,
    amount: 2.123706,
    total: 2339983.57
  },
  {
    price: 3303.56,
    amount: 2.162396,
    total: 2338127.48
  },
  {
    price: 3305.3,
    amount: 2.122771,
    total: 2342075.01
  },
  {
    price: 3306.07,
    amount: 2.104501,
    total: 2339233.94
  },
  {
    price: 3307.72,
    amount: 2.07672,
    total: 2343530.81
  },
  {
    price: 3311.53,
    amount: 2.066255,
    total: 2347651.28
  },
  {
    price: 3316.45,
    amount: 2.043873,
    total: 2344250.25
  },
  {
    price: 3314.45,
    amount: 2.056899,
    total: 2342507.56
  },
  {
    price: 3313.04,
    amount: 2.047346,
    total: 2338912.45
  },
  {
    price: 3314.69,
    amount: 2.051709,
    total: 2342511.26
  },
  {
    price: 3310.29,
    amount: 2.088892,
    total: 2346345.08
  },
  {
    price: 3309.6,
    amount: 2.133122,
    total: 2348807.25
  },
  {
    price: 3308.26,
    amount: 2.135334,
    total: 2347261.23
  },
  {
    price: 3309.3,
    amount: 2.181057,
    total: 2344724.5
  },
  {
    price: 3308.34,
    amount: 2.149766,
    total: 2340524.2
  },
  {
    price: 3311.08,
    amount: 2.186694,
    total: 2341038.29
  },
  {
    price: 3308.17,
    amount: 2.156192,
    total: 2343258.09
  },
  {
    price: 3304.74,
    amount: 2.157933,
    total: 2340499.52
  },
  {
    price: 3306.17,
    amount: 2.12563,
    total: 2340676.81
  }
] satisfies TradeflowDataType[];
