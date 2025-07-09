import { X } from "lucide-react";

const Modal = ({
  children,
  closeFn,
}: {
  children: React.ReactNode;
  closeFn: () => void;
}) => {
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50  flex justify-center items-center w-full md:inset-0 h-full max-h-full backdrop-blur-xs">
      <div className="bg-white px-5 py-5 pt-8 relative rounded-lg border-2">
        {children}
        <div
          className="absolute right-1 top-1 cursor-pointer font-bold"
          onClick={closeFn}
        >
          <X />
        </div>
      </div>
    </div>
  );
};

export default Modal;
