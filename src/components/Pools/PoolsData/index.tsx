"use client";

// Library Imports
import { useEffect, useMemo, useState } from "react";
import { TabsList } from "@radix-ui/react-tabs";
import { PlusIcon, Table } from "lucide-react";
// Component Imports
// import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsTrigger } from "@components/ui/tabs";
import PoolsTable from "./PoolsTable";
import { allPoolsColumnDef, userPoolsColumnDef } from "./pool-columns";
import SearchInput from "./SearchInput";
import CreatePoolModal from "../create-pool-modal";
import ManagePoolModal from "../manage-pool-modal";
// Library, Store Imports
import { cn } from "@lib/utils";
import { usePools } from "@lib/hooks/usePools";
import { TableOptions } from "./helper";
// import { usePoolsStore } from "@store/poolsStore";
import { useFilteredPools } from "@lib/hooks/useFilteredPools";
import { useAccount } from "wagmi";
import MyPoolsTable from "./MyPoolsTable";

const PoolsData = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [allTerm, setAllTerm] = useState("");
  const [myTerm, setMyTerm] = useState("");
  const [txTerm, setTxTerm] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openManageModal, setOpenManageModal] = useState(false);
  const { address } = useAccount();

  const [currentTab, setCurrentTab] = useState(TableOptions.all);

  const { pools, isFetching, refetch } = usePools();

  const { pools: filteredAllPools } = useFilteredPools(pools, allTerm);
  const { pools: filteredMyPools } = useFilteredPools(pools, myTerm);
  const { pools: filteredTxPools } = useFilteredPools(pools, txTerm);

  const poolsColumns = allPoolsColumnDef();
  const userColumns = userPoolsColumnDef();
  // const txColumns = txColumnDef();

  const activeTabStyle =
    "py-2 px-4 data-[state=active]:border data-[state=active]:border-[#00A0FC] rounded-lg data-[state=active]:bg-[#0A344D]";

  return (
    <div className="py-10">
      <Tabs value={currentTab} onValueChange={setCurrentTab as (value: string) => void}>
        <div className="inline-flex items-center justify-between w-full font-medium text-sm/5 py-4 border-t border-b border-secondary-gray">
          <TabsList className="inline-flex">
            <TabsTrigger value={TableOptions.all} className={cn(activeTabStyle)}>
              All Pools
            </TabsTrigger>
            <TabsTrigger value={TableOptions.my} className={cn(activeTabStyle)}>
              My Pools
            </TabsTrigger>
            <TabsTrigger value={TableOptions.trxn} className={cn(activeTabStyle)}>
              Transactions
            </TabsTrigger>
          </TabsList>
          <div className="inline-flex items-center gap-6">
            <button
              className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex"
              onClick={() => setOpenManageModal(true)}
            >
              <PlusIcon size={16} /> Manage Pool
            </button>
            <button
              className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex"
              onClick={() => setOpenCreateModal(true)}
            >
              <PlusIcon size={16} /> Create Pool
            </button>
            <SearchInput
              term={allTerm}
              setTerm={setAllTerm}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
        <TabsContent value={TableOptions.all}>
          <PoolsTable
            columns={poolsColumns}
            data={filteredAllPools}
            loading={isFetching}
          />
        </TabsContent>
        <TabsContent value={TableOptions.my}>
          <MyPoolsTable
            columns={userColumns}
            data={filteredMyPools.filter((pool) => pool.poolOp === address)}
            // data={pools.filter((pool) => pool.poolAddr === address)}
            loading={isFetching}
          />
        </TabsContent>
        {/*<TabsContent value={TableOptions.trxn}>
          <PoolsTable columns={transactionsColumnDef} data={potentiaPoolsList} />
        </TabsContent> */}
      </Tabs>
      {openCreateModal && (
        <CreatePoolModal open={openCreateModal} setOpen={setOpenCreateModal} />
      )}
      {openManageModal && (
        <ManagePoolModal open={openManageModal} setOpen={setOpenManageModal} />
      )}
    </div>
  );
};

export default PoolsData;
