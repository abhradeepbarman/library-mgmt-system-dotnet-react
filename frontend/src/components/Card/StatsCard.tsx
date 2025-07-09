interface IStatsCardProps {
  name: string;
  number: number;
  icon: React.ReactNode;
  classname?: string;
}

const StatsCard = (props: IStatsCardProps) => {
  return (
    <div
      className={`border-2 border-gray-300 w-[195px] flex items-center justify-start gap-x-3 p-2 rounded-lg ${props.classname}`}
    >
      <div className="border p-2 border-gray-400 rounded-xl">
        <p>{props.icon}</p>
      </div>
      <div>
        <p className="text-2xl font-semibold ml-1">{props.number}</p>
        <p>{props.name}</p>
      </div>
    </div>
  );
};

export default StatsCard;
