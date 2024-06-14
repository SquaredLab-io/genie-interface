"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import toDollarUnits from "@lib/utils";
import { OpenPosition, openPositions, Token } from "./helper";
import OpenPositionsTable from "./OpenPositionsTable";
import TransactionsHistoryTable from "./TransactionsHistoryTable";

enum Tab {
  position = "position",
  history = "history"
}

export const columns: ColumnDef<OpenPosition>[] = [
  {
    accessorKey: "assets",
    header: () => (
      <div className="pl-10 pr-8 w-full border-r border-[#303030]">
        <span>Assets</span>
      </div>
    ),
    cell: ({ row }) => {
      const { assets, power, protocol } = row.original;
      return (
        <div className="whitespace-nowrap py-3 flex flex-row gap-2 text-left font-medium pl-10 pr-8 border-r border-[#303030]">
          <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-1">
            {assets.map((asset: Token) => (
              <div
                key={asset.symbol}
                className="z-0 flex overflow-hidden ring-2 ring-[#E5E7EB] rounded-full bg-neutral-800"
              >
                <Image src={asset.imgSrc} alt={asset.symbol} width={30} height={30} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <div className="inline-flex gap-2">
              <p className="font-extrabold text-sm leading-5">
                {assets.map((asset: Token, index) => (
                  <>
                    <span key={index}>{asset.symbol}</span>
                    {assets.length !== index + 1 && (
                      <span className="text-[#9299AA]">/</span>
                    )}
                  </>
                ))}
              </p>
              <p className="font-medium text-xs leading-3 bg-[#1A3B00] py-[4.5px] px-[9px] rounded-md">
                p = {power}
              </p>
            </div>
            <p className="font-normal text-xs leading-5 text-[#6D6D6D]">{protocol}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "date",
    header: () => <span className="pl-[76px]">Date/Time</span>,
    cell: ({ row }) => {
      const { time, date } = row.original;
      return (
        <p className="flex flex-col text-left whitespace-nowrap pl-[76px]">
          <span>{date}</span>
          <span className="text-[#6D6D6D]">{time}</span>
        </p>
      );
    }
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = parseFloat(row.getValue("size"));
      const formatted = toDollarUnits(size, 2);
      return <span>{formatted}</span>;
    }
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const formatted = toDollarUnits(value, 2);
      return <span>{formatted}</span>;
    }
  },
  {
    accessorKey: "pnl",
    header: "PNL",
    cell: ({ row }) => {
      const pnlValue = parseFloat(row.getValue("pnl"));
      const formatted = toDollarUnits(pnlValue, 2);
      return <span className="text-[#07AE3B]">{formatted}</span>;
    }
  },
  {
    accessorKey: "return",
    header: "%Return",
    cell: ({ row }) => {
      const returnValue = parseFloat(row.getValue("return"));
      return <span className="text-[#07AE3B]">{returnValue}%</span>;
    }
  },
  {
    accessorKey: "action",
    header: () => <span className="pl-4">Action</span>,
    cell: ({ row }) => {
      return (
        <Button type="button" variant="ghost">
          <span className="bg-gradient-to-r text-transparent bg-clip-text from-pure-blue to-pure-cyan">
            Close Position
          </span>
        </Button>
      );
    }
  }
];

const TradeData = () => {
  return (
    <div className="font-medium text-xs leading-4 bg-primary-gray font-sans-manrope">
      {/* Tab Row */}
      <Tabs defaultValue={Tab.position}>
        <TabsList className="flex flex-row justify-start gap-8 py-2 px-10 rounded-none border-b border-[#303030] font-normal text-xs leading-9">
          <TabsTrigger
            value={Tab.position}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-blue data-[state=active]:to-pure-cyan"
          >
            Open Positions
          </TabsTrigger>
          <TabsTrigger
            value={Tab.history}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-blue data-[state=active]:to-pure-cyan"
          >
            Trade History
          </TabsTrigger>
        </TabsList>
        {/* Tab Content */}
        <TabsContent value={Tab.position}>
          <OpenPositionsTable columns={columns} data={openPositions} />
        </TabsContent>
        <TabsContent value={Tab.history}>
          <TransactionsHistoryTable columns={columns} data={openPositions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeData;
