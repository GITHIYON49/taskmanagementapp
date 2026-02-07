import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderKanban,
  Users,
  Settings,
  User,
  CheckSquare,
  X,
} from "lucide-react";
import ProjectsSidebar from "./ProjectsSidebar";
import MyTasksSidebar from "./MyTasksSidebar";

const Sidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "My Tasks", path: "/my-tasks", icon: CheckSquare },
    { name: "Team", path: "/team", icon: Users },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-0
          h-screen w-64 sm:w-72
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto
        `}
      >
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0">
            <span className="text-base sm:text-lg font-bold text-white">T</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            TaskManager
          </h1>
        </Link>

        <div className="lg:hidden flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-2 sm:p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-2 sm:gap-3 rounded-lg px-3 py-2 sm:py-2.5 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200">
          <ProjectsSidebar onLinkClick={handleLinkClick} />
        </div>

        <div className="border-t border-gray-200">
          <MyTasksSidebar />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
