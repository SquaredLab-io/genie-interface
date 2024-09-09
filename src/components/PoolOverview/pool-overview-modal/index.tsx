import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// hooks
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { useFilteredPools } from "../../../lib/hooks/useFilteredPools";

// components
import SearchInput from "./SearchInput";
import Modal from "@components/common/Modal";
import PoolOverviewTable from "./PoolOverviewTable";
import { Separator } from "@components/ui/separator";

// utility helpers and types
import { PoolInfo } from "@squaredlab-io/sdk";
import { REFETCH_INTERVAL } from "@lib/constants";
import { makeMarketDataApiRequest } from "@lib/apis";
import { getTokenSymbol, POOL_ID_MAP } from "@lib/utils/pools";
import { poolOverviewColumnDef } from "./pool-overview-columns";
import { useFilteredPoolOverview } from "@lib/hooks/useFilteredPoolOverview";

interface PropsType {
  children?: ReactNode | undefined;
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface PoolOverviewData {
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface FetchPoolsDataResponse extends PoolOverviewData{
  underlying_symbol: string;
}

export interface ConstructedPoolsDataResponse extends FetchPoolsDataResponse{
  pool: string;
  power: number;
}

type PoolSymbol = keyof typeof POOL_ID_MAP;

const fetchPoolsData = async (pools: PoolInfo[] | undefined): Promise<FetchPoolsDataResponse[]> => {
  if (!pools) return [];

  const uniqueUnderlyings = Array.from(new Set(pools.map(pool => pool.underlying)));
  console.log('underlying unique symbols : ', uniqueUnderlyings);

  const promiseResults = await Promise.all(
    uniqueUnderlyings.map(async(underlying) => {
      const symbol = getTokenSymbol(underlying) as PoolSymbol;
      const response = await makeMarketDataApiRequest(
        `coins/markets?vs_currency=usd&ids=${POOL_ID_MAP[symbol].id}&price_change_percentage=24h`
      );
      const data: PoolOverviewData = response[0];
      return {
        underlying_symbol: underlying,
        current_price: data.current_price,
        price_change_percentage_24h: data.price_change_percentage_24h,
        total_volume: data.total_volume
      };
    })
  );
  return promiseResults;
};

export default function PoolOverviewModal({ children, open, setOpen }: PropsType) {
  // Search term
  const [term, setTerm] = useState("");

  // hooks
  const { pools, isFetching } = usePools();
  const { updateSelectedPool } = usePoolsStore((state) => state);
  // const { pools: filteredAllPools } = useFilteredPools(pools, term);

  const poolOverviewColumns = poolOverviewColumnDef(updateSelectedPool);

  // react-query
  const { 
    data: poolOverviewData, 
    isLoading: isPoolOverviewDataLoading 
  } = useQuery<FetchPoolsDataResponse[], Error>({
    queryKey: ['poolOverviewData', pools],
    queryFn: () => fetchPoolsData(pools),
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!pools,
  });
  console.log("pool overview market data : ", poolOverviewData);

  const { filteredPoolsOverview } = useFilteredPoolOverview(pools, poolOverviewData, term);
  console.log("filtered pools overview : ", filteredPoolsOverview);
  const isLoading = isFetching || isPoolOverviewDataLoading;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      closable={true}
      className="bg-primary-gray min-w-[40rem] rounded-lg"
    >
      <div className="pt-2 pb-6 pl-4 mr-20">
        <SearchInput
          term={term}
          setTerm={setTerm}
          placeholder="Search markets"
          // className="mt-5"
        />
      </div>
      <Separator />
      <h1 className="inline-flex font-medium text-[15px]/[18px] pt-4 pl-4 w-full">Pools</h1>
      {/* <PoolsList pools={pools!} noPools={noPools} setModalOpen={setOpen} /> */}
      <PoolOverviewTable
        columns={poolOverviewColumns}
        data={filteredPoolsOverview}
        loading={isLoading}
      />
    </Modal>
  );
}
