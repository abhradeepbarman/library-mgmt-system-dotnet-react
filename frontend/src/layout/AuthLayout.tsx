import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/common/sidebar/Sidebar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("accessToken");
  return (
    <div>
      {accessToken ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-h-full">{children}</div>
        </div>
      ) : (
        <Navigate to={"/login"} />
      )}
    </div>
  );
};

export default AuthLayout;
