"use client";

// import { ReactNode, useMemo, useState } from "react";
import Modal from "@components/common/Modal";
import { DialogHeader, DialogDescription, DialogTitle } from "@components/ui/dialog";
import notification from "@components/common/notification";
import CreatePoolForm from "./CreatePoolForm";

const CreatePoolModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  /* const [sqlDiscount, setSqlDiscount] = useState<number[]>([0]);
  const [halfLife, setHalfLife] = useState<number>(0);
  const [priceUpdateFactor, setPriceUpdateFactor] = useState<number>(0);

  const VAULT_ADDRESS = "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c";

  const [isSqlDiscValid, sqlDiscMin, sqlDiscMax] = useMemo(() => {
    const disc = sqlDiscount[0];
    if (disc > 0 && disc <= 2000) {
      return [true, false, false];
    }
    return [false, disc < 0, disc > 2000];
  }, [sqlDiscount]);

  const isValidUpdate =
    halfLife > 0 &&
    !isNaN(halfLife) &&
    priceUpdateFactor > 0 &&
    !isNaN(priceUpdateFactor) &&
    !isSqlDiscValid; */

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-[698px] sm:rounded-lg"
      closable={true}
    >
      <DialogHeader className="pt-11 pb-14 px-6">
        <DialogTitle>Pool Settings</DialogTitle>
        <DialogDescription>
          Create a new pool or create a liquidity position on an existing pool.
        </DialogDescription>
      </DialogHeader>
      <CreatePoolForm />
    </Modal>
  );
};

export default CreatePoolModal;
