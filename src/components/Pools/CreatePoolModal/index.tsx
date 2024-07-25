"use client";

import { useState } from "react";
import Modal from "@components/common/Modal";
import SliderBar from "@components/common/SliderBar";
import { DialogHeader, DialogDescription, DialogTitle } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { PiCopy } from "react-icons/pi";
import CopyToClipboard from "react-copy-to-clipboard";
import { shortenHash } from "@lib/utils/formatting";
import notification from "@components/common/notification";
import { Separator } from "@components/ui/separator";
import ButtonCTA from "@components/common/button-cta";

const CreatePoolModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [sqlDiscount, setSqlDiscount] = useState<number[]>([0]);
  const VAULT_ADDRESS = "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c";

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-[698px]"
      closable={true}
    >
      <DialogHeader className="pt-11 pb-14 px-6">
        <DialogTitle>Manage Pool Settings</DialogTitle>
        <DialogDescription>
          Create a new pool or create a liquidity position on an existing pool.
        </DialogDescription>
      </DialogHeader>
      <div className="p-6 flex flex-col gap-10">
        <div className="flex flex-row items-start justify-between">
          <h5>SQL Discount Lock</h5>
          <div className="w-1/2">
            <Input
              placeholder="0"
              value={sqlDiscount[0]}
              onChange={(e) => setSqlDiscount([parseFloat(e.target.value)])}
              type="number"
              className="p-4 bg-transparent"
            />
            <SliderBar
              value={sqlDiscount}
              setValue={setSqlDiscount}
              min={0}
              max={2000}
              step={1}
              className="mt-4"
              indices={[0, 500, 1000, 1500, 2000]}
            />
          </div>
        </div>
        <div className="space-y-2 text-right font-normal text-base/6 text-[#94A3B8]">
          <p>
            Position Discount : <span className="font-bold text-white">5%</span>
          </p>
          <p className="inline-flex items-center gap-2">
            <span>Vault Address :</span>
            <span className="font-bold text-white">{shortenHash(VAULT_ADDRESS)}</span>
            <CopyToClipboard
              text={VAULT_ADDRESS}
              onCopy={() => {
                notification.success({
                  title: "Vault Address copied!",
                  duration: 2000
                });
              }}
            >
              <button aria-label="button to copy vault address">
                <PiCopy className="text-white" />
              </button>
            </CopyToClipboard>
          </p>
        </div>
      </div>
      <Separator />
      <div className="pt-10 px-6 pb-6">
        <h4 className="font-normal text-base/6 text-[#94A3B8] mb-6">Advanced</h4>
        <div className="flex flex-row items-start justify-between mb-12">
          <h5>Position Half Life</h5>
          <div className="w-1/2">
            <Input
              placeholder="0"
              value={sqlDiscount[0]}
              onChange={(e) => setSqlDiscount([parseFloat(e.target.value)])}
              type="number"
              className="p-4 bg-transparent"
            />
          </div>
        </div>
        <div className="flex flex-row items-start justify-between mb-10">
          <h5>Price Update Factor</h5>
          <div className="w-1/2">
            <Input
              placeholder="0"
              value={sqlDiscount[0]}
              onChange={(e) => setSqlDiscount([parseFloat(e.target.value)])}
              type="number"
              className="p-4 bg-transparent"
            />
            <SliderBar
              value={sqlDiscount}
              setValue={setSqlDiscount}
              min={0}
              max={1}
              step={0.25}
              className="mt-4"
              indices={[0, 0.25, 0.5, 0.75, 1]}
            />
          </div>
        </div>
        <ButtonCTA className="w-1/2 rounded-lg float-right">Update</ButtonCTA>
      </div>
      <Separator />
      <div className="pt-10 px-6 pb-6">
        <h4 className="font-normal text-base/6 text-[#94A3B8] mb-6">Pool Operators</h4>
        <ButtonCTA className="w-1/2 rounded-lg float-right">New PO</ButtonCTA>
      </div>
    </Modal>
  );
};

export default CreatePoolModal;
