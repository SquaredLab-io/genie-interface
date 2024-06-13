export type Token = {
  symbol: string;
  imgSrc: string;
};

export type OpenPosition = {
  assets: Token[];
  power: number;
  protocol: string;
  date: string;
  time: string;
  size: string;
  value: string;
  pnl: string;
  return: string;
};

// dummy List of user's open positions
export const openPositions: OpenPosition[] = [
  {
    assets: [
      {
        symbol: "WETH",
        imgSrc: "/icons/ethereum.svg"
      },
      {
        symbol: "ROME",
        imgSrc: "/icons/rome.svg"
      }
    ],
    power: 4,
    protocol: "Potentia V1",
    date: "21/07/2024",
    time: "00:45",
    size: "75000000",
    value: "75000000",
    pnl: "1500000",
    return: "31.02"
  },
  {
    assets: [
      {
        symbol: "WETH",
        imgSrc: "/icons/ethereum.svg"
      },
      {
        symbol: "ROME",
        imgSrc: "/icons/rome.svg"
      }
    ],
    power: 4,
    protocol: "Potentia V1",
    date: "21/07/2024",
    time: "00:45",
    size: "75000000",
    value: "75000000",
    pnl: "1500000",
    return: "31.02"
  },
  {
    assets: [
      {
        symbol: "WETH",
        imgSrc: "/icons/ethereum.svg"
      },
      {
        symbol: "ROME",
        imgSrc: "/icons/rome.svg"
      }
    ],
    power: 4,
    protocol: "Potentia V1",
    date: "21/07/2024",
    time: "00:45",
    size: "75000000",
    value: "75000000",
    pnl: "1500000",
    return: "31.02"
  },
  {
    assets: [
      {
        symbol: "WETH",
        imgSrc: "/icons/ethereum.svg"
      },
      {
        symbol: "ROME",
        imgSrc: "/icons/rome.svg"
      }
    ],
    power: 4,
    protocol: "Potentia V1",
    date: "21/07/2024",
    time: "00:45",
    size: "75000000",
    value: "75000000",
    pnl: "1500000",
    return: "31.02"
  }
];
