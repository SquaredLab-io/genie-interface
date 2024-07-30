export default function TradeInfo() {
  return (
    <div className="flex flex-col gap-2 mt-5 font-normal text-xs/[14px]">
      <p className="inline-flex items-center justify-between w-full">
        <span className="text-[#6D6D6D]">Fee (0.555)</span>
        <span className="font-medium">0.25%</span>
      </p>
      <p className="inline-flex items-center justify-between w-full">
        <span className="text-[#6D6D6D]">TVL</span>
        <span className="font-medium">0.25%</span>
      </p>
      <p className="inline-flex items-center justify-between w-full">
        <span className="text-[#6D6D6D]">Volume (24h)</span>
        <span className="font-medium">0.25%</span>
      </p>
      <p className="inline-flex items-center justify-between w-full">
        <span className="text-[#6D6D6D]">Conversion Fee</span>
        <span className="font-medium">0.25%</span>
      </p>
    </div>
  );
}
