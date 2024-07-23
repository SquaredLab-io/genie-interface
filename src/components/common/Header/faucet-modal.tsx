"use client";

import Image from "next/image";
import ModalTrigger from "@components/common/Modal";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { useEffect, useState } from "react";
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
import { SUPPORTED_NETWORKS, SUPPORTED_TOKENS } from "@lib/constants";

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

  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[0]);
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);

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
        {/* NETWORK SELECTOR */}
        <div className="space-y-3 w-full">
          <label>Select Network</label>
          <Select
            value={selectedNetwork.NAME}
            onValueChange={(value) => {
              const network = SUPPORTED_NETWORKS.find((n) => n.NAME === value)!;
              setSelectedNetwork(network);
            }}
          >
            <SelectTrigger className="border border-secondary-gray uppercase rounded-sm px-4 pt-2 pb-1">
              <SelectValue
                placeholder={
                  <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                    <Image
                      src={selectedNetwork.LOGO}
                      alt={selectedNetwork.NAME}
                      height="24"
                      width="24"
                      className="border"
                    />
                    <span className="border">{selectedNetwork.NAME}</span>
                  </p>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_NETWORKS.map((network) => (
                <SelectItem value={network.NAME} key={network.NAME} className="pt-2 pb-1 pl-[9.5px] pr-[9.5px]">
                  <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                    <Image src={network.LOGO} alt={network.NAME} height="24" width="24" />
                    {network.NAME}
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* TOKEN SELECTOR */}
        <div className="space-y-3 w-full">
          <label>Select Token</label>
          <Select
            value={selectedToken.token}
            onValueChange={(value) => {
              const token = SUPPORTED_TOKENS.find((token) => token.token === value)!;
              setSelectedToken(token);
            }}
          >
            <SelectTrigger className="border border-secondary-gray uppercase rounded-sm pt-2 pb-1">
              <SelectValue
                placeholder={
                  <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                    <Image
                      src={SUPPORTED_TOKENS[0].logo}
                      alt={SUPPORTED_TOKENS[0].token}
                      height="24"
                      width="24"
                    />
                    {SUPPORTED_TOKENS[0].token}
                  </p>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_TOKENS.map((token) => (
                <SelectItem
                  value={token.token}
                  key={token.logo}
                  className="data-[state=checked]:bg-[#293849] hover:bg-[#293849] pt-2 pb-1 pl-[9.5px] pr-[9.5px]"
                >
                  <p className="inline-flex items-center justify-start gap-x-2">
                    <Image src={token.logo} alt={token.token} height="24" width="24" />
                    {token.token.toUpperCase()}
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* CTA */}
        <ButtonCTA disabled={isLoading} className="w-full rounded-[4px]">
          {isLoading ? <SpinnerIcon className="size-[22px]" /> : <span>GET TOKENS</span>}
        </ButtonCTA>
      </div>
    </ModalTrigger>
  );
};

export default FaucetModal;
