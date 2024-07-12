import { useState } from "react";
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
import { tradeFlowData, TradeflowDataType } from "../helper";

function getTradeflowData(layout: TradeflowLayout, data: TradeflowDataType[]) {
  switch (layout) {
    case TradeflowLayout.all:
      return data;
    case TradeflowLayout.positive:
      return data.filter((d, i) => {
        if (i == 0) return true;
        else d.amount > data[i - 1].amount;
      });
    case TradeflowLayout.negative:
      return data.filter((d, i) => {
        if (i == 0) return true;
        else d.amount < data[i - 1].amount;
      });
  }
}

const TradeFlow = () => {
  const [tradeflowLayout, setTradeflowLayout] = useState<TradeflowLayout>(
    TradeflowLayout.all // default show all
  );

  return (
    <div className="flex-col w-full max-w-[267px] h-full max-h-[392px] border-l border-secondary-gray overflow-auto">
      <h1 className="font-medium text-sm/5 p-4">Trade Flow</h1>
      <Separator />
      <div className="flex flex-col pt-3 pl-3">
        {/* Layout Selections */}
        <div className="inline-flex items-center justify-start gap-1 mb-2">
          {[TradeflowLayout.all, TradeflowLayout.positive, TradeflowLayout.negative].map(
            (layout) => (
              <button
                key={layout}
                className={cn(
                  layout == tradeflowLayout && "bg-secondary-gray",
                  "hover:bg-secondary-gray"
                )}
                onClick={() => {
                  setTradeflowLayout(layout);
                }}
              >
                <NextImage
                  src={`/icons/trade-flow-${layout}.svg`}
                  altText={`${layout}-layout`}
                  className="size-6 max-w-fit"
                />
              </button>
            )
          )}
        </div>
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
            {getTradeflowData(tradeflowLayout, tradeFlowData).map((data, index) => (
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
