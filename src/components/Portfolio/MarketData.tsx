const MarketData = () => {
  const rowStyle = "inline-flex items-center justify-between w-full";
  return (
    <div className="px-4 pb-4">
      <h3 className="font-medium text-sm/[54px]">Market Data</h3>
      <div className="flex flex-col gap-2 font-normal text-xs/[14px]">
        <p className={rowStyle}>
          <span className="text-[#757B80]">Price</span>
          <span className="font-medium">$0.482</span>
        </p>
        <p className={rowStyle}>
          <span className="text-[#757B80]">Market Cap</span>
          <span className="font-medium">$482M</span>
        </p>
        <p className={rowStyle}>
          <span className="text-[#757B80]">Volume (24h)</span>
          <span className="font-medium">$291M</span>
        </p>
        <p className={rowStyle}>
          <span className="text-[#757B80]">Day Change</span>
          <span className="font-medium">-0.54%</span>
        </p>
        <p className={rowStyle}>
          <span className="text-[#757B80]">Max Total Supply</span>
          <span className="font-medium">$1.5 billion</span>
        </p>
      </div>
    </div>
  );
};

export default MarketData;
