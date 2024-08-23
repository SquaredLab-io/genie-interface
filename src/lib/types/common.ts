/**
 * Token Selector Popover Size
 */
export declare const PopoverSizeOptions: {
  readonly COMPACT: "compact";
  readonly WIDE: "wide";
};
export type PopoverSizes = (typeof PopoverSizeOptions)[keyof typeof PopoverSizeOptions];
export declare const PopoverSizeContext: React.Context<PopoverSizes>;

/**
 * useBalance ReturnType from Wagmi
 */
export interface BalanceType {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}
