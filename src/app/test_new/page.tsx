"use client";

import { useIsMounted } from "@lib/hooks/useIsMounted";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";

export default function TestNew() {
  // let potentia: PotentiaSdk;

  // const publicClient = usePublicClient() as PublicClient;
  // const { data, isFetching, isSuccess, status } = useWalletClient();

  // const { address } = useAccount();

  // if (address && chainId) {
  //   potentia = new PotentiaSdk(publicClient, data as WalletClient);
  // }

  const { isMounted } = useIsMounted();
  const { potentia } = usePotentiaSdk();
  // useEffect(() => {
  //   if (isSuccess && address) {
  //     console.log("walletClient", data);
  //     console.log("publicClient", publicClient);
  //     console.log("address", address);
  //   } else if (isFetching) {
  //     console.log("isfetching");
  //   }
  // }, [data, address, isFetching, isSuccess, publicClient]);

  // useEffect(() => {
  // (async () => {
  //   const poolReserves = await potentia.getReserve(
  //     CONTRACT_ADDRESSES.POTENTIA_POOL_ADDR
  //   );
  //   console.log("pool reserves", poolReserves);
  // })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [address]);

  if (!isMounted) {
    return <></>;
  }

  return (
    <div>
      <p>Nice</p>
    </div>
  );
}
