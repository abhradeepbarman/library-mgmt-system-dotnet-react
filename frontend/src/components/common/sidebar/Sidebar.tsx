import { ChevronLeft, LibraryBig, LogOut, UserPen } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/utils";
import LogoutConfirmModal from "../../ConfirmModal/LogoutConfirmModal";
import Modal from "../Modal";
import SidebarItem from "./SidebarItem";
import UserProfile from "./UserProfile";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(
    window.innerWidth < 500 ? true : false
  );
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const menuItems = [
    {
      icon: LibraryBig,
      label: "All Books",
      active: false,
      slug: "/dashboard/books",
    },
    {
      icon: UserPen,
      label: "Authors",
      active: false,
      slug: "/dashboard/authors",
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-r-[#EBEDEE] bg-[#F5F7F9] sticky top-0",
        isCollapsed ? "w-20" : "w-60",
        className
      )}
    >
      {/* Header */}
      <div className="relative border-b border-b-[#EBEDEE] px-4 py-3">
        <Link to={"/books"} className="flex items-center space-x-1">
          <img src="/logo.png" alt="App Name Logo" className="w-10 h-10" />
          <span
            className={cn(
              "text-xl font-bold text-gray-800 transition-opacity duration-200",
              isCollapsed && "hidden opacity-0"
            )}
          >
            Capsitech
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="absolute top-4 -right-3 cursor-pointer rounded-full border border-[#EBEDEE] bg-white p-1 text-gray-600 hover:bg-[#EBEDEE]"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <SidebarItem {...item} isCollapsed={isCollapsed} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto border-t border-t-[#EBEDEE] flex flex-col gap-y-2">
        {/* User Profile */}
        <UserProfile isCollapsed={isCollapsed} />

        {/* Logout Button */}
        <button
          className="px-2 pb-2 ml-3 cursor-pointer"
          onClick={() => setShowConfirmLogout(true)}
        >
          <div className="flex gap-x-2 items-center font-semibold">
            <LogOut className="w-4 h-4" />
            <span className={`${isCollapsed ? "hidden opacity-0" : ""}`}>
              Logout
            </span>
          </div>
        </button>
      </div>

      {showConfirmLogout && (
        <Modal closeFn={() => setShowConfirmLogout(false)}>
          <LogoutConfirmModal closeFn={() => setShowConfirmLogout(false)} />
        </Modal>
      )}
    </aside>
  );
};

export default Sidebar;
