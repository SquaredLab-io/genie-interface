export const getTokenSymbol = (symbol: string | undefined): string => {
  if (!symbol) return "";
  switch (symbol) {
    case "WBTC":
      return "BTC";
    case "WETH":
      return "ETH";
    default:
      return symbol;
  }
};

export const getActionType = (
  action?: "AL" | "RL" | "PC" | "OL" | "CL" | "OS" | "CS"
): string => {
  switch (action) {
    case "AL":
      return "Add Liquidity";
    case "RL":
      return "Remove Liquidity";
    case "PC":
      return "Create Pool";
    default:
      return "";
  }
};
