import { PoolInfo } from "@lib/types/pools";

interface ReturnType {
  pools: PoolInfo[];
  noPools: boolean;
}

export function useFilteredPools(pools: PoolInfo[] | undefined, term: string): ReturnType {
  if (!pools) return { pools: [], noPools: true };
  else if (term == "") return { pools, noPools: false };
  const searchTerm = term.toLowerCase();
  const filtered = pools.filter((pool) => {
    const matchTerm = `${pool.pool}`.toLowerCase();
    if (matchTerm.indexOf(searchTerm) >= 0) return true;
    return false;
  });
  const noPools = filtered.length === 0;
  return { pools: filtered, noPools };
}
