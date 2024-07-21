"use client";

import Image from "next/image";
import ModalTrigger from "@components/common/Modal";
import { potentiaPoolsList } from "@lib/pools";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";
import ButtonCTA from "../button-cta";
import SpinnerIcon from "@components/icons/SpinnerIcon";

const FaucetModal = ({
  open,
  setOpen,
  trigger
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  trigger?: React.ReactNode;
}) => {
  const { potentia } = usePotentiaSdk();
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { isMounted } = useIsMounted();

  async function getFaucet(tokenAddress: string) {
    try {
      setIsLoading(true);
      const hash = await potentia?.callFaucet(tokenAddress, address as string);
      if (hash) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMounted) {
    return <></>;
  }

  return (
    <ModalTrigger
      open={open}
      onOpenChange={setOpen}
      title="Get Test Tokens"
      description="Select to get 50 Tokens on Base Sepolia"
      trigger={trigger}
      className="p-5 min-w-fit"
    >
      <div className="flex flex-col items-start text-left space-y-[22px] font-medium text-base/[14px]">
        <div className="space-y-3 w-full">
          <label>Select Network</label>
          <Select>
            <SelectTrigger className="border border-secondary-gray uppercase rounded-sm">
              <SelectValue placeholder="ETHEREUM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">ETHEREUM</SelectItem>
              <SelectItem value="dark">POLYGON</SelectItem>
              <SelectItem value="system">ARBITRUM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3 w-full">
          <label>Select Token</label>
          <Select>
            <SelectTrigger className="border border-secondary-gray uppercase rounded-sm">
              <SelectValue placeholder="ETH" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">ETH</SelectItem>
              <SelectItem value="dark">MATIC</SelectItem>
              <SelectItem value="system">BTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ButtonCTA disabled={isLoading} className="w-full rounded-[4px]">
          {isLoading ? <SpinnerIcon className="size-[22px]" /> : <span>GET TOKENS</span>}
        </ButtonCTA>
      </div>
    </ModalTrigger>
  );
};

export default FaucetModal;

/*
      <div className="flex flex-row gap-3 border">
        {potentiaPoolsList.map((pool, index) => (
          <button
            key={pool.id}
            onClick={() => {
              getFaucet(pool.underlyingTokens[0].address);
            }}
            className="flex flex-row items-center gap-1 p-0 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            <div key={index} className="z-0 flex flex-row gap-2">
              <Image
                src={pool.underlyingTokens[0].icon}
                alt={pool.underlyingTokens[0].symbol}
                width={24}
                height={24}
              />
              <span>{pool.underlyingTokens[0].symbol}</span>
            </div>
          </button>
        ))}
      </div>
      {isLoading && (
        <div className="text-center w-full">
          <p>loading faucets...</p>
        </div>
      )}
*/
