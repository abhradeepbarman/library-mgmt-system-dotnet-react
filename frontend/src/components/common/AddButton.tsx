import { Plus } from "lucide-react";

const AddButton = ({
  title,
  onclick,
}: {
  title: string;
  onclick: () => void;
}) => {
  return (
    <div
      className="flex justify-center items-center gap-x-2 px-3 py-1 bg-black text-white font-semibold rounded-lg cursor-pointer"
      onClick={onclick}
    >
      <Plus /> Add {title}
    </div>
  );
};

export default AddButton;
