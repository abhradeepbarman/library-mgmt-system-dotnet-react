import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      className="gap-x-1 cursor-pointer font-semibold active:bg-neutral-800 active:text-white transition-all duration-300 border  p-2 rounded-lg  items-center flex w-fit"
    >
      <ChevronLeft />
      Back
    </div>
  );
};

export default BackButton;
