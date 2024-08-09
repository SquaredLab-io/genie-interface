"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Address } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import CopyToClipboard from "react-copy-to-clipboard";
import { PiCopy } from "react-icons/pi";
import Modal from "@components/common/Modal";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";
import ButtonCTA from "@components/common/button-cta";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { CONFIRMATION, SUPPORTED_NETWORKS, SUPPORTED_TOKENS } from "@lib/constants";
import { DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { isValidAddress } from "@lib/utils/checkVadility";
import notification from "../notification";
import { shortenHash } from "@lib/utils/formatting";

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
  const { isConnected, address } = useAccount();

  const [isTxLoading, setIsTxLoading] = useState(false);
  // const { isMounted } = useIsMounted();

  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[0]);
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [inputAddress, setInputAddress] = useState<string>("");
  const [txHash, setTxHash] = useState<Address>();

  const isValidInput = isValidAddress(inputAddress);

  async function getFaucet(tokenAddress: string, userAddress: string) {
    try {
      setIsTxLoading(true);
      // Default and only Network: Base Sepolia
      const hash = await potentia?.poolWrite.callFaucet(tokenAddress, userAddress);
      if (hash) {
        setTxHash(hash as Address);
        setIsTxLoading(false);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsTxLoading(false);
    }
  }

  // wait for openPosition transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  // Notifications based on Transaction status
  useEffect(() => {
    if (isError) {
      notification.error({
        title: "Faucet Transaction failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      // refetchBalance();
      // refetchPosition();
      // refetchOpenOrders();
      // refetchTxHistory();
      notification.success({
        title: "Faucet transferred Successfully"
      });
    }
  }, [isSuccess, isError]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className="p-5 w-full max-w-[337px]"
    >
      <DialogHeader className="mb-[26px]">
        <DialogTitle className="text-[22px]/[27px]">Get Test Tokens</DialogTitle>
        <DialogDescription className="text-xs/[14px]">
          Description for Faucet.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-start text-left gap-y-5 font-medium text-base/[14px]">
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
            <SelectTrigger className="border border-secondary-gray uppercase rounded-[4px] px-4 pt-2 pb-1">
              <SelectValue
                placeholder={
                  <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                    <Image
                      src={selectedNetwork.LOGO}
                      alt={selectedNetwork.NAME}
                      height="24"
                      width="24"
                    />
                    <span>{selectedNetwork.NAME}</span>
                  </p>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_NETWORKS.map((network) => (
                <SelectItem
                  value={network.NAME}
                  key={network.NAME}
                  className="pt-2 pb-1 pl-[9.5px] pr-[9.5px]"
                >
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
            <SelectTrigger className="border border-secondary-gray uppercase rounded-[4px] pt-2 pb-1">
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
        {/* ADDRESS */}
        <div className="flex flex-col space-y-3 w-full mt-6">
          <label htmlFor="user-address">Wallet Address</label>
          {isConnected ? (
            <div
              id="user-address"
              className="font-normal text-left text-sm text-[#cdd7df] inline-flex items-center gap-x-2"
            >
              {shortenHash(address)}
              <CopyToClipboard
                text={address!}
                onCopy={() => {
                  notification.success({
                    title: "User Address copied",
                    duration: 2000
                  });
                }}
              >
                <button aria-label="button to copy vault address">
                  <PiCopy className="text-white" />
                </button>
              </CopyToClipboard>
            </div>
          ) : (
            <span className="font-normal text-left text-sm text-[#a2adb5]">
              No connected account found
            </span>
          )}
          {/* <Input
            placeholder="0xxxxxxxxx..."
            type="type"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            className={cn(
              "placeholder:text-[#404950]",
              !isValidInput && inputAddress !== "" && "border-negative-red"
            )}
          /> */}
        </div>
        {/* CTA */}
        <ButtonCTA
          disabled={isTxLoading || (isPending && isLoading) || !isConnected}
          className="w-full rounded-[4px]"
          onClick={() => {
            console.log("args", {
              tokenAdd: selectedToken.address,
              userAddr: inputAddress
            });
            getFaucet(selectedToken.address, inputAddress);
          }}
        >
          {isTxLoading || isLoading ? (
            <SpinnerIcon className="size-[22px]" />
          ) : isConnected ? (
            <span>GET TOKENS</span>
          ) : (
            <span>Please Connect Wallet</span>
          )}
        </ButtonCTA>
      </div>
    </Modal>
  );
};

export default memo(FaucetModal);
