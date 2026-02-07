// import { useEffect, useRef } from "react";
// import { NavLink, useNavigate,Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import {
//   FolderOpenIcon,
//   LayoutDashboardIcon,
//   UsersIcon,
//   LogOutIcon,
// } from "lucide-react";
// import toast from "react-hot-toast";

// import MyTasksSidebar from "./MyTasksSidebar";
// import ProjectSidebar from "./ProjectsSidebar";
// import { logout } from "../features/authSlice";

// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
//   const sidebarRef = useRef(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const menuItems = [
//     { name: "Dashboard", href: "/", icon: LayoutDashboardIcon },
//     { name: "Projects", href: "/projects", icon: FolderOpenIcon },
//     { name: "Team", href: "/team", icon: UsersIcon },
//   ];
  

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setIsSidebarOpen]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//     toast.success("Logged out successfully");
//   };

//   return (
//     <aside
//       ref={sidebarRef}
//       className={`z-10 h-screen min-w-68 border-r border-gray-200 bg-white flex flex-col
//         max-sm:absolute transition-all duration-300
//         ${isSidebarOpen ? "left-0" : "-left-full sm:left-0"}`}
//     >

    

//       <div className="flex-1 overflow-y-auto no-scrollbar">
//         <div className="space-y-1 p-4">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.href}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 rounded px-4 py-2 text-gray-800 transition
//                 ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`
//               }
//             >
//               <item.icon size={16} />
//               <span className="truncate text-sm">{item.name}</span>
//             </NavLink>
//           ))}
//         </div>

//         <MyTasksSidebar />
//         <ProjectSidebar />
//       </div>

//       <div className="p-4 border-t border-gray-200">
//         <button
//           onClick={handleLogout}
//           className="flex w-full items-center gap-3 rounded px-4 py-2 text-red-600 transition hover:bg-red-50"
//         >
//           <LogOutIcon size={16} />
//           <span className="truncate text-sm">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import { useState } from "react";
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
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
          <Link to="/" className="flex items-center gap-2 p-4 border-b border-gray-200">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-blue-600">
              <span className="text-lg font-bold text-white">T</span>
            </div>
           <h1 className="text-xl font-bold text-gray-900">TaskManager</h1>
          </Link>

        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Projects Sidebar */}
        <div className="border-t border-gray-200">
          <ProjectsSidebar onLinkClick={handleLinkClick} />
        </div>

        {/* My Tasks Sidebar */}
        <div className="border-t border-gray-200">
          <MyTasksSidebar />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;