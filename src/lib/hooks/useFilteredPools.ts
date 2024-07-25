import { Pool } from "@lib/types/common";

export function useFilteredPools(pools: Pool[], term: string) {
  if (!pools) return { pools, noPools: true };
  else if (term == "") return { pools, noPools: false };
  const searchTerm = term.toLowerCase();
  const filtered = pools.filter((pool) => {
    const [asset0, asset1] = pool.underlyingTokens;
    const matchTerm = `${asset0.symbol} ${asset1.symbol} ${pool.symbol}`.toLowerCase();
    if (matchTerm.indexOf(searchTerm) >= 0) return true;
    return false;
  });
  const noPools = filtered.length === 0;
  return { pools: filtered, noPools };
}
