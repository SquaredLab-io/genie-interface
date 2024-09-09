import { ConstructedPoolsDataResponse, FetchPoolsDataResponse } from "@components/PoolOverview/pool-overview-modal";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";

interface ReturnType {
    filteredPoolsOverview: ConstructedPoolsDataResponse[];
    noPools: boolean;
}

const getConstructedPoolOverviewData = (
    pools: PoolInfo[],
    poolsOverviewData: FetchPoolsDataResponse[]
): ConstructedPoolsDataResponse[] => {
    const constructedPoolOverviewData = pools.map((_pool) => {
        const overviewData = poolsOverviewData.find((poolOverviewData) => _pool.underlying === poolOverviewData.underlying_symbol) as FetchPoolsDataResponse;
        return { ...overviewData, pool: _pool.pool, power: _pool.power }
    });

    return constructedPoolOverviewData;
}

export function useFilteredPoolOverview(
    pools: PoolInfo[] | undefined,
    poolsOverviewData: FetchPoolsDataResponse[] | undefined,
    term: string
): ReturnType {
    if (!pools || !poolsOverviewData) return { filteredPoolsOverview: [], noPools: true };
    else if (term == "") {
        const constructedPoolOverviewData = getConstructedPoolOverviewData(pools, poolsOverviewData);
        return { filteredPoolsOverview: constructedPoolOverviewData, noPools: false };
    };

    const constructedPoolOverviewData = getConstructedPoolOverviewData(pools, poolsOverviewData);
    const searchTerm = term.toLowerCase();
    const filtered = constructedPoolOverviewData.filter((pool) => {
        const matchTerm = `${pool.underlying_symbol}`.toLowerCase();
        if (matchTerm.indexOf(searchTerm) >= 0) return true;
        return false;
    });
    const noPools = filtered.length === 0;
    return { filteredPoolsOverview: filtered, noPools };
}
