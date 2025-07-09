const FilterOptions = ({
  defaultOption,
  options,
  className,
  onchange,
  value,
}: {
  defaultOption: string;
  options: string[];
  className?: string;
  onchange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}) => {

  return (
    <select
      className={`${className} bg-gray-100 text-gray-600 px-3 border border-gray-500 h-10 rounded-lg capitalize`}
      onChange={onchange}
      value={value}
    >
      <option selected disabled value="">
        {defaultOption}
      </option>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
};

export default FilterOptions;
