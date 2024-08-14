"use client";

import { ReactNode, useMemo, useState } from "react";
import Modal from "@components/common/Modal";
import SliderBar from "@components/common/SliderBar";
import { DialogHeader, DialogDescription, DialogTitle } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import notification from "@components/common/notification";
import { Separator } from "@components/ui/separator";
import ButtonCTA from "@components/common/button-cta";
import { cn } from "@lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";

const CreatePoolModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [sqlDiscount, setSqlDiscount] = useState<number[]>([0]);
  const [halfLife, setHalfLife] = useState<number>(0);
  const [priceUpdateFactor, setPriceUpdateFactor] = useState<number[]>([0]);
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
    priceUpdateFactor[0] > 0 &&
    !isNaN(priceUpdateFactor[0]) &&
    !isSqlDiscValid;

  interface BoxInfo {
    title: string;
    children: ReactNode;
    description?: string;
  }

  const BoxInfo = ({ title, description, children }: BoxInfo) => (
    <div className="flex flex-row items-start justify-between">
      <div className="flex flex-col gap-y-2 w-1/2 float-left">
        <h4 className="font-medium text-lg/[18px]">{title}</h4>
        {description && <p className="text-base/6 text-[#94A3B8]">{description}</p>}
      </div>
      <div className="w-1/2 float-right">{children}</div>
    </div>
  );

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
      {/* Basic Pool Configs */}
      <div className="p-6 flex flex-col gap-20">
        {/* Underlying Tokens */}
        <BoxInfo
          title="Underlying Token"
          description="Select the network you would like to provide liquidity on."
        >
          <p>Select Token</p>
          {/* <Select>
            <SelectTrigger>
              <SelectValue>Select Token</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">x</SelectItem>
              <SelectItem value="2">x</SelectItem>
              <SelectItem value="3">x</SelectItem>
            </SelectContent>
          </Select> */}
        </BoxInfo>
        <BoxInfo
          title="Initial Liquidity"
          description="Which token pair would you like to add 
liquidity to."
        >
          <Input
            placeholder="0"
            value={priceUpdateFactor[0]}
            onChange={(e) => setPriceUpdateFactor([parseFloat(e.target.value)])}
            type="number"
            className="p-4 bg-transparent"
          />
          <SliderBar
            value={priceUpdateFactor}
            setValue={setPriceUpdateFactor}
            min={0}
            max={1}
            step={0.001}
            className="mt-4"
            indices={[1, 90, 180, 269, 358]}
          />
        </BoxInfo>
        <BoxInfo
          title="Set Power"
          description="Which token pair would you like to add 
liquidity to."
        >
          <SliderBar
            value={[2]}
            setValue={() => {}}
            min={2}
            max={32}
            step={0.001}
            className="mt-5"
            indices={[2, 4, 8, 16, 32]}
          />
        </BoxInfo>
        <BoxInfo
          title="SQL Fees"
          description="Which token pair would you like to add 
liquidity to."
        >
          <Input
            placeholder="0"
            value={priceUpdateFactor[0]}
            onChange={(e) => setPriceUpdateFactor([parseFloat(e.target.value)])}
            type="number"
            className="p-4 bg-transparent"
          />
          <SliderBar
            value={[2]}
            setValue={() => {}}
            min={2}
            max={32}
            step={0.001}
            className="mt-5"
            indices={[2, 4, 8, 16, 32]}
          />
        </BoxInfo>
        <p className="w-full text-right font-normal text-base/6 text-[#94A3B8]">
          Position Discount : <span className="font-bold text-white">15.5%</span>
        </p>
      </div>
      <Separator />
      {/* Advanced Section */}
      <div className="p-6">
        <h4 className="font-normal text-base/6 text-[#94A3B8] mb-6">Advanced</h4>
        <div className="flex flex-row items-start justify-between mb-20">
          <h5>Position Half Life</h5>
          <div className="w-1/2">
            <Input
              placeholder="0"
              value={halfLife}
              onChange={(e) => setHalfLife(parseFloat(e.target.value))}
              type="number"
              className="p-4 bg-transparent"
            />
            <SliderBar
              value={[0]}
              setValue={() => {}}
              min={0}
              max={1000}
              step={0.001}
              className="mt-5"
              indices={[0, 250, 500, 750, 1000]}
            />
          </div>
        </div>
        <div className="flex flex-row items-start justify-between mb-20">
          <h5>Price Update Factor</h5>
          <div className="w-1/2">
            <Input
              placeholder="0"
              value={priceUpdateFactor[0]}
              onChange={(e) => setPriceUpdateFactor([parseFloat(e.target.value)])}
              type="number"
              className="p-4 bg-transparent"
            />
            <SliderBar
              value={priceUpdateFactor}
              setValue={setPriceUpdateFactor}
              min={0}
              max={1}
              step={0.001}
              className="mt-4"
              indices={[0, 0.25, 0.5, 0.75, 1]}
            />
          </div>
        </div>
        <ButtonCTA className="w-1/2 rounded-lg float-right" disabled={!isValidUpdate}>
          Create Pool
        </ButtonCTA>
      </div>
    </Modal>
  );
};

export default CreatePoolModal;
