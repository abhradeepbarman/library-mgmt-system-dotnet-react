import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const LogoutConfirmModal = ({ closeFn }: { closeFn: () => void }) => {
  const navigate = useNavigate();

  const userLogout = async () => {
    const toastId = toast.loading("Loading...");
    try {
      await axiosInstance.post("/Auth/logout");
      toast.success("Logged out successfully");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="px-3">
      <p className="text-2xl font-semibold">Logout</p>
      <p>Are you sure you want to logout?</p>
      <div className="flex justify-between mt-5 gap-5">
        <button
          onClick={closeFn}
          className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-semibold cursor-pointer border-2 border-black outline-none bg-transparent hover:bg-black text-black hover:text-white transition-all duration-300 flex-1"
        >
          Cancel
        </button>
        <button
          onClick={userLogout}
          className="px-5 py-2.5 rounded-lg cursor-pointer text-white text-sm tracking-wider font-medium border border-current outline-none bg-orange-700 hover:bg-orange-800 active:bg-orange-700 flex-1"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
