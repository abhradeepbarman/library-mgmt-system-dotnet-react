import type { Dispatch, SetStateAction } from "react";

const SearchBar = ({
  placeholder,
  className,
  searchText,
  setSearchText,
}: {
  placeholder: string;
  className?: string;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className={`flex items-center gap-x-2 ${className}`}>
      <input
        placeholder={placeholder}
        className={`border p-2 px-3 rounded-lg border-gray-400 min-w-[500px] h-10 bg-gray-100`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
