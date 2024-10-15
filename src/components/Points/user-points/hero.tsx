import { shortenHash } from "@lib/utils/formatting";
import { Address } from "viem";

interface Props {
  address: Address | undefined;
}

const Hero = ({ address }: Props) => {
  return (
    <div className="flex flex-col gap-y-2 items-start w-full">
      <h1 className="font-medium text-[2rem]/9">{shortenHash(address)}</h1>
      {/* <p className="font-normal text-base/[22px] text-[#98B0C1]">
        has been a user since 25 September 2024
      </p> */}
    </div>
  );
};

export default Hero;
