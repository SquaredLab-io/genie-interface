import { ReactNode, useState } from "react";
import { Separator } from "@components/ui/separator";
import { useFilteredPools } from "../../../lib/hooks/useFilteredPools";
import SearchInput from "./SearchInput";
import PoolsList from "./PoolsList";
import { usePoolsStore } from "@store/poolsStore";
import Modal from "@components/common/Modal";

interface PropsType {
  children?: ReactNode | undefined;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function OverviewTokenModal({ children, open, setOpen }: PropsType) {
  // Search term
  const [term, setTerm] = useState("");

  const { poolsData, updateSelectedPool } = usePoolsStore((state) => state);
  const { pools, noPools } = useFilteredPools(poolsData, term);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      closable={false}
      className="bg-primary-gray min-w-[400px] rounded-lg"
    >
      <div className="pt-4 pb-6 px-4">
        <h1 className="inline-flex font-medium text-[15px]/[18px]">Select a Token</h1>
        <SearchInput
          term={term}
          setTerm={setTerm}
          placeholder="Search markets"
          className="mt-5"
        />
      </div>
      <Separator />
      <PoolsList
        pools={pools!}
        updateSelectedPool={updateSelectedPool}
        noPools={noPools}
      />
    </Modal>
  );
}
