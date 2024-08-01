"use client";

// Library Imports
import { useEffect, useMemo, useState } from "react";
import { TabsList } from "@radix-ui/react-tabs";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
// Component Imports
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsTrigger } from "@components/ui/tabs";
import PoolsTable from "./PoolsTable";
import { allPoolsColumnDef, transactionsColumnDef, userPoolsColumnDef } from "./pool-columns";
import SearchInput from "./SearchInput";
import CreatePoolModal from "../create-pool-modal";
import ManagePoolModal from "../manage-pool-modal";
// Library, Store Imports
import { cn } from "@lib/utils";
import { usePools } from "@lib/hooks/usePools";
import { TableOptions } from "./helper";
import { usePoolsStore } from "@store/poolsStore";
import { useFilteredPools } from "@lib/hooks/useFilteredPools";

const PoolsData = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [term, setTerm] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openManageModal, setOpenManageModal] = useState(false);
  
  const { pools, isFetching, refetch } = usePools();
  const { updatePoolsData, poolsData } = usePoolsStore();
  const { updateSelectedPool } = usePoolsStore();

  const _pools = useMemo(() => {
    if (poolsData) {
      // 1. checking if pools exists globally
      return poolsData;
    } else if (pools) {
      // 2. if not pools, fetch them
      return pools;
    }
    return [];
  }, [poolsData, pools]);

  const { pools: filteredPools } = useFilteredPools(_pools, term);

  useEffect(() => {
    if (pools.length) {
      // If there're pools, update it globally
      updatePoolsData(pools);
      console.log("pools updated", pools);
    }
  }, [pools]);

  const poolsColumns = allPoolsColumnDef();
  const userColumns = userPoolsColumnDef();

  const activeTabStyle =
    "py-2 px-4 data-[state=active]:border data-[state=active]:border-[#00A0FC] rounded-lg data-[state=active]:bg-[#0A344D]";

  return (
    <div className="py-10">
      <Button onClick={refetch} variant={"secondary"}>Fetch Pools</Button>
      <Tabs defaultValue={TableOptions.all}>
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
              term={term}
              setTerm={setTerm}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
        <TabsContent value={TableOptions.all}>
          <PoolsTable columns={poolsColumns} data={filteredPools} loading={isFetching} />
        </TabsContent>
        {/* <TabsContent value={TableOptions.my}>
          <PoolsTable columns={userPoolsColumnDef} data={pools} />
        </TabsContent>
        <TabsContent value={TableOptions.trxn}>
          <PoolsTable columns={transactionsColumnDef} data={potentiaPoolsList} />
        </TabsContent> */}
      </Tabs>
      {openCreateModal && <CreatePoolModal open={openCreateModal} setOpen={setOpenCreateModal} />}
      {openManageModal && <ManagePoolModal open={openManageModal} setOpen={setOpenManageModal} />}
    </div>
  );
};

export default PoolsData;
