import { ColumnDef } from "@tanstack/react-table";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const TransactionsHistoryTable = <TData, TValue>({
  columns,
  data
}: PropsType<TData, TValue>) => {
  return <></>;
};

export default TransactionsHistoryTable;
