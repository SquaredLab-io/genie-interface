import { Input } from "@components/ui/input";
import { SearchIcon } from "lucide-react";

interface PropsType {
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
  term: string;
  setTerm: (value: string) => void;
}

export default function SearchInput({ showSearch, setShowSearch, term, setTerm }: PropsType) {
  return !showSearch ? (
    <button className="p-[6px] text-white" onClick={() => setShowSearch(true)}>
      <SearchIcon size={24} />
    </button>
  ) : (
    <div className="relative">
      <SearchIcon
        size="16"
        className="absolute top-0 bottom-0 my-auto left-4 font-normal text-[#536374]"
      />
      <Input
        type="search"
        id="text"
        autoFocus={false}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        placeholder={"Search Pools..."}
        className="bg-[#1E2739] pl-9 placeholder:text-[#536374] font-normal text-xs/5 rounded-[4px]"
      />
    </div>
  );
}
