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
import { TradeflowLayout } from "@lib/types/enums";
import { getTradeflowData } from "./helper";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";
import { usePoolsStore } from "@store/poolsStore";
import { formatOraclePrice } from "@lib/utils/formatting";

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

  const { selectedPool } = usePoolsStore();

  const { data, isFetching, refetch } = useTradeHistory();

  const tradeHistory = getTradeflowData(tradeflowLayout, data);

  return (
    <div className="hidden col-span-1 xl:flex flex-col overflow-hidden border-l border-secondary-gray h-full min-h-[426px]">
      {/* <div className="hidden col-span-1 xl:flex flex-col border-l border-secondary-gray overflow-auto border"> */}
      <h1 className="font-medium text-sm/5 p-4">Trade Flow {isFetching && "..."}</h1>
      <Separator />
      <div className="flex flex-col pt-3 pl-3">
        {/* Layout Selections */}
        <LayoutSelector layout={tradeflowLayout} setLayout={setTradeflowLayout} />
        {/* TradeFlow table */}
        <Table>
          <TableHeader>
            <TableRow className="text-[#6A6A6D] text-xs/4">
              <TableHead className="font-normal pb-1">Price (USDC)</TableHead>
              <TableHead className="font-normal pb-1">
                Amount ({selectedPool()?.underlying.toUpperCase()})
              </TableHead>
              {/* <TableHead className="font-normal pb-1">Total</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeHistory.length > 0 ? (
              tradeHistory.map((tHistory, index) => (
                <TableRow
                  key={`${tHistory.size}_${index}`}
                  className="font-normal text-[11px]/4"
                >
                  <TableCell
                    className={cn(
                      "py-[2px]",
                      tHistory.action == "OL" ? "text-[#07AE3B]" : "text-[#FC0A52]"
                    )}
                  >
                    $
                    {formatOraclePrice(
                      tHistory.oraclePrice,
                      selectedPool()?.underlyingDecimals
                    )}
                  </TableCell>
                  <TableCell className="py-[2px]">
                    {formatOraclePrice(tHistory.size, selectedPool()?.underlyingDecimals)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="font-normal text-[11px]/4">
                {isFetching ? <span>...</span> : <span>No Data available</span>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradeFlow;
