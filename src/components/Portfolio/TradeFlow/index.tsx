import { Dispatch, SetStateAction, useState } from "react";
import { Separator } from "@components/ui/separator";
import NextImage from "@components/common/NextImage";
import { cn } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { TradeflowLayout } from "@lib/types/portfolio";
import { getTradeflowData, tradeFlowData } from "./helper";

const LayoutSelector = ({
  layout,
  setLayout
}: {
  layout: TradeflowLayout;
  setLayout: Dispatch<SetStateAction<TradeflowLayout>>;
}) => {
  return (
    <div className="inline-flex items-center justify-start gap-1 mb-2">
      {[TradeflowLayout.all, TradeflowLayout.positive, TradeflowLayout.negative].map(
        (tfl) => (
          <button
            key={tfl}
            className={cn(
              tfl == layout && "bg-secondary-gray rounded-sm",
              "hover:bg-secondary-gray"
            )}
            onClick={() => {
              setLayout(tfl);
            }}
          >
            <NextImage
              src={`/icons/trade-flow-${tfl}.svg`}
              altText={`${tfl}-layout`}
              className="size-6 max-w-fit"
            />
          </button>
        )
      )}
    </div>
  );
};

const TradeFlow = () => {
  const [tradeflowLayout, setTradeflowLayout] = useState<TradeflowLayout>(
    TradeflowLayout.all // default show all
  );

  const data = getTradeflowData(tradeflowLayout, tradeFlowData);

  return (
    <div className="hidden col-span-1 xl:flex flex-col border-l border-secondary-gray overflow-auto">
      <h1 className="font-medium text-sm/5 p-4">Trade Flow</h1>
      <Separator />
      <div className="flex flex-col pt-3 pl-3">
        {/* Layout Selections */}
        <LayoutSelector layout={tradeflowLayout} setLayout={setTradeflowLayout} />
        {/* TradeFlow table */}
        <Table>
          <TableHeader>
            <TableRow className="text-[#6A6A6D] text-xs/4">
              <TableHead className="font-normal pb-1">Price (USDT)</TableHead>
              <TableHead className="font-normal pb-1">Amount (BTC)</TableHead>
              <TableHead className="font-normal pb-1">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data, index) => (
              <TableRow
                key={`${data.amount}_${index}`}
                className="font-normal text-[11px]/4"
              >
                <TableCell
                  className={cn(
                    "py-[2px]",
                    index !== 0 && data.amount < tradeFlowData[index - 1].amount
                      ? "text-[#FC0A52]"
                      : "text-[#07AE3B]"
                  )}
                >
                  {data.price}
                </TableCell>
                <TableCell className="py-[2px]">{data.amount}</TableCell>
                <TableCell className="py-[2px]">{data.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradeFlow;
