import { Link, useLocation } from "react-router-dom";
import { cn } from "../../../utils/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  slug: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isCollapsed,
  slug = "#",
}) => {
  const location = useLocation();

  return (
    <Link
      to={slug}
      className={`group flex items-center rounded px-4 py-2 text-sm transition ${
        location.pathname === slug ? "bg-gray-200" : ""
      }`}
    >
      <Icon className="size-4 flex-shrink-0 transition-colors" />
      <span
        className={cn(
          "ml-4 font-medium transition-opacity duration-200",
          isCollapsed && "hidden opacity-0"
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarItem;
