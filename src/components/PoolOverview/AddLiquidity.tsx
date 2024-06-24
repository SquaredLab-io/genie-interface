import Image from "next/image";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

const AddLiquidity = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <div className="bg-primary-gray rounded-base">
        <div className="p-5 border-b border-[#2A2C30]">
          <span className="font-normal text-xs/4 text-[#8F9BAA]">Add Liquidity</span>
          <div className="flex flex-col text-[#D4D4D4] items-center justify-center h-60">
            <span className="text-7xl/[98px] font-medium">$0</span>
            <span className="font-normal text-base/5">0 ETH</span>
          </div>
        </div>
        <div className="px-5 py-4 inline-flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-3">
            <Image src="/icons/ethereum.svg" alt="Asset icon" height={42} width={42} />
            <p className="flex flex-col justify-between font-normal text-base/5 text-[#8F9BAA]">
              <span>ETH</span>
              <span className="text-xs/4">Balance: 0</span>
            </p>
          </div>
          <button className="p-2 -m-2 rounded-full">
            <HiChevronDown size={10} color="#8F9BAA" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-base bg-primary-gray py-4 px-5 mt-1 font-normal text-base/5 text-[#8F9BAA]">
        <span>LP Tokens</span>
        <span className="text-xs/4">LP Tokens you will recieve: 0</span>
      </div>
      <div className="mt-1">
        <button className="w-full bg-[#202832] hover:bg-[#475B72] rounded-[3px] font-bold text-[14px] leading-6 text-[#3D85C6] text-center py-[14px] transition-colors duration-200">
          Add Liquidity
        </button>
      </div>
    </>
  );
};

export default AddLiquidity;
