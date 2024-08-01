export enum PoolOptions {
  weth = "weth",
  wbtc = "wbtc",
  usdc = "usdc"
}

export const getTokenSymbol = (symbol: string | undefined): string => {
  switch (symbol) {
    case "WBTC":
      return "BTC";
    case "WETH":
      return "ETH";
    default:
      return "";
  }
};
