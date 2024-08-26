"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Address } from "viem";
import {
  useAccount,
  useToken,
  useWaitForTransactionReceipt,
  useWalletClient
} from "wagmi";
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
import { CONFIRMATION, meta, SUPPORTED_NETWORKS, SUPPORTED_TOKENS } from "@lib/constants";
import { DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import notification from "../notification";
import { shortenHash } from "@lib/utils/formatting";
import Link from "next/link";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePoolsStore } from "@store/poolsStore";

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
  const { data: walletClient } = useWalletClient();

  // form states
  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[0]);

  const { selectedPool } = usePoolsStore();

  const [selectedToken, setSelectedToken] = useState(
    SUPPORTED_TOKENS.find((token) => {
      return token.address === selectedPool()?.underlyingAddress;
    }) ?? SUPPORTED_TOKENS[0]
  );

  const { refetch: refetchBalance } = useTokenBalance({
    token: selectedPool()?.underlyingAddress as Address,
    decimals: selectedPool()?.underlyingDecimals,
    symbol: selectedPool()?.underlying
  });

  // tx states
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<Address>();

  // addToken() adds token into the connected wallet
  async function addToken() {
    try {
      const success = await walletClient?.watchAsset({
        type: "ERC20",
        options: {
          address: selectedToken.address,
          decimals: selectedToken.decimals,
          symbol: selectedToken.token
        }
      });

      if (success) {
        notification.success({
          id: "facuet-success",
          title: `${selectedToken.token} token added in your Account`,
          description: "Please check in the wallet"
        });
      }
    } catch (error) {
      notification.error({
        id: "facuet-error",
        title: `Failed to add ${selectedToken.token} in the wallet`,
        description: `${error}`
      });
    }
  }

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
        id: "facuet-tx-error",
        title: "Faucet Transaction failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      // TODO: refetchBalance();
      refetchBalance();
      notification.success({
        id: "facuet-tx-success",
        title: "Test tokens transferred succeesfully to your account"
      });
      // prompt to add token into the wallet
      addToken();
    }
  }, [isSuccess, isError]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className="p-5 w-full max-w-[337px] sm:rounded-lg"
    >
      <DialogHeader className="mb-[26px]">
        <DialogTitle className="text-[22px]/[27px]">Get Test Tokens</DialogTitle>
        <DialogDescription className="text-sm/[19px] text-[#CACACC]">
          Click the button below to receive your test net tokens. Need more?{" "}
          <Link
            href={meta.DISCORD}
            className="text-primary-blue hover:underline underline-offset-2"
          >
            Join our Discord
          </Link>{" "}
          for exclusive access to additional tokens.
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
        <div className="flex flex-col space-y-2 w-full mt-4 text-right">
          <label htmlFor="user-address">Wallet Address</label>
          <span
            id="user-address"
            className="font-normal text-sm text-[#6D6D6D] inline-flex items-center justify-end gap-x-2"
          >
            {isConnected ? shortenHash(address) : "Connect Wallet to recieve tokens"}
          </span>

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
          className="w-full rounded-[4px] font-sans-ibm-plex"
          onClick={() => {
            getFaucet(selectedToken.address, address!);
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
