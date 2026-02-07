import { useEffect, useRef } from "react";
import { NavLink, useNavigate,Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FolderOpenIcon,
  LayoutDashboardIcon,
  UsersIcon,
  LogOutIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import MyTasksSidebar from "./MyTasksSidebar";
import ProjectSidebar from "./ProjectsSidebar";
import { logout } from "../features/authSlice";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    { name: "Projects", href: "/projects", icon: FolderOpenIcon },
    { name: "Team", href: "/team", icon: UsersIcon },
  ];
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <aside
      ref={sidebarRef}
      className={`z-10 h-screen min-w-68 border-r border-gray-200 bg-white flex flex-col
        max-sm:absolute transition-all duration-300
        ${isSidebarOpen ? "left-0" : "-left-full sm:left-0"}`}
    >

      <Link to="/" className="flex items-center gap-2 p-4 border-b border-gray-200">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-blue-600">
              <span className="text-lg font-bold text-white">T</span>
            </div>
           <h1 className="text-xl font-bold text-gray-900">TaskManager</h1>
          </Link>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-4 py-2 text-gray-800 transition
                ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`
              }
            >
              <item.icon size={16} />
              <span className="truncate text-sm">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <MyTasksSidebar />
        <ProjectSidebar />
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded px-4 py-2 text-red-600 transition hover:bg-red-50"
        >
          <LogOutIcon size={16} />
          <span className="truncate text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
