export type Token = {
  symbol: string;
  imgSrc: string;
};

export type Amount = {
  value: string;
  growth: string;
};

export type PoolType = {
  assets: Token[];
  network: string;
  power: number;
  age: string;
  tvl: string;
  volume: Amount;
  fee: Amount;
  protocol: string;
};

// dummy List of user's open positions
export const allPoolsData: PoolType[] = [
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
    network: "Base",
    power: 4,
    protocol: "Potentia V1",
    age: "2M 5d",
    tvl: "60110000", // in dollars
    volume: {
      value: "60110000", // in dollars
      growth: "18" // in %
    },
    fee: {
      value: "32.1",
      growth: "18"
    }
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
    network: "Base",
    power: 4,
    protocol: "Potentia V1",
    age: "2M 5d",
    tvl: "60110000", // in dollars
    volume: {
      value: "60110000", // in dollars
      growth: "18" // in %
    },
    fee: {
      value: "32.1",
      growth: "18"
    }
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
    network: "Base",
    power: 4,
    protocol: "Potentia V1",
    age: "2M 5d",
    tvl: "60110000", // in dollars
    volume: {
      value: "60110000", // in dollars
      growth: "-18" // in %
    },
    fee: {
      value: "32.1",
      growth: "18"
    }
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
    network: "Base",
    power: 4,
    protocol: "Potentia V1",
    age: "2M 5d",
    tvl: "60110000", // in dollars
    volume: {
      value: "60110000", // in dollars
      growth: "-18" // in %
    },
    fee: {
      value: "32.1",
      growth: "-18"
    }
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
    network: "Base",
    power: 4,
    protocol: "Potentia V1",
    age: "2M 5d",
    tvl: "60110000", // in dollars
    volume: {
      value: "60110000", // in dollars
      growth: "18" // in %
    },
    fee: {
      value: "32.1",
      growth: "-18"
    }
  },
];
