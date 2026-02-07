import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2Icon } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loading = useSelector((state) => state.project?.loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2Icon className="size-7 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex bg-white text-gray-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-1 flex-col h-screen">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 overflow-y-scroll p-6 xl:p-10 xl:px-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
