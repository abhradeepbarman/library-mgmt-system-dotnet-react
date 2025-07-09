import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import { cn } from "../../../utils/utils";

const UserProfile = ({ isCollapsed }: { isCollapsed: Boolean }) => {
  const [user, setUser] = useState({
    name: undefined,
    email: undefined,
  });

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/Auth/me");
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching user ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex cursor-pointer items-center px-4 py-3 transition hover:bg-gray-100">
      <img
        src={`https://ui-avatars.com/api/?name=${user.name}`}
        alt="John Doe"
        className="size-8 rounded-full"
      />
      <div
        className={cn(
          "ml-3 flex flex-col transition-opacity duration-200",
          isCollapsed && "hidden opacity-0"
        )}
      >
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
    </div>
  );
};

export default UserProfile;
