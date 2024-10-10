// Library Imports
import { FC, memo, ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// Component Imports
import Modal from "@components/common/Modal";
import { Separator } from "@components/ui/separator";
import TokenSelectorTable from "./token-selector-table";
import SearchInput from "@components/PoolOverview/pool-overview-modal/SearchInput";
// Hook, Helper and Type Imports
import { usePools } from "@lib/hooks/usePools";
import { REFETCH_INTERVAL } from "@lib/constants";
import getPoolsMarketData from "@lib/utils/getPoolsData";
import { FetchPoolsDataResponse, useFilteredPoolOverview } from "@lib/hooks/useFilteredPoolOverview";
import { poolsColumnDef } from "./poolsColumnDef";

interface PropsType {
  children?: ReactNode | undefined;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const TokenSelectorModal: FC<PropsType> = ({ children, open, setOpen }) => {
  const [term, setTerm] = useState("");
  const { pools, isFetching } = usePools();

  const poolsColumns = poolsColumnDef();

  // get pools_market_data
  const { data: poolOverviewData, isLoading: isPoolOverviewDataLoading } = useQuery<
    FetchPoolsDataResponse[],
    Error
  >({
    queryKey: ["poolOverviewData"],
    queryFn: () => getPoolsMarketData(pools),
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!pools,
    staleTime: 10000,
    gcTime: 30000
  });

  // Filtering based on Search term
  const { filteredPoolsOverview } = useFilteredPoolOverview(
    pools,
    poolOverviewData,
    term
  );

  const isLoading = isFetching || isPoolOverviewDataLoading;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      closable={true}
      className="bg-primary-gray min-w-[40rem] rounded-lg pt-2 pb-4"
    >
      <div className="pb-4 pl-5 mr-20">
        <SearchInput term={term} setTerm={setTerm} placeholder="Search markets" />
      </div>
      <Separator />
      <h1 className="inline-flex font-medium text-sm/5 pt-6 pl-4 pb-3 w-full">Pools</h1>
      <TokenSelectorTable
        columns={poolsColumns}
        data={filteredPoolsOverview}
        loading={isLoading}
        setOpen={setOpen}
        pools={pools!}
      />
    </Modal>
  );
};

export default memo(TokenSelectorModal);
