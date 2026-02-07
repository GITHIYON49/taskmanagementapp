import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../features/authSlice";
import { clearAuthData } from "../utils/authHelper";
import { notificationAPI } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const projects = useSelector((state) => state.project?.projects || []);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await notificationAPI.getAll();
        setNotifications(response.data);

        const countResponse = await notificationAPI.getUnreadCount();
        setUnreadCount(countResponse.data.count);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    projects.forEach((project) => {
      if (
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      ) {
        results.push({
          type: "project",
          id: project._id,
          title: project.name,
          subtitle: project.description || "No description",
          link: `/projects/${project._id}`,
        });
      }

      if (project.tasks) {
        project.tasks.forEach((task) => {
          if (
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query)
          ) {
            results.push({
              type: "task",
              id: task._id,
              title: task.title,
              subtitle: `${project.name} • ${task.status.replace("_", " ")}`,
              link: `/projects/${project._id}/tasks/${task._id}`,
            });
          }
        });
      }
    });

    setSearchResults(results.slice(0, 10));
    setShowSearchResults(results.length > 0);
  }, [searchQuery, projects]);

  const handleSearchSelect = (link) => {
    navigate(link);
    setSearchQuery("");
    setShowSearchResults(false);
    setShowMobileSearch(false);
  };

  const handleLogout = () => {
    clearAuthData();
    dispatch(logout());
    navigate("/login");
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            
            {/* Desktop Search Bar */}
            <div
              className="hidden md:block relative flex-1 max-w-md mx-4"
              ref={searchRef}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects and tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchResults.length > 0 && setShowSearchResults(true)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSearchSelect(result.link)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                                result.type === "project"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {result.type}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowMobileSearch(true)}
                className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg border border-gray-200 bg-white shadow-lg max-h-[80vh] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <button
                            key={notification._id}
                            onClick={() => {
                              markAsRead(notification._id);
                              if (notification.link) {
                                navigate(notification.link);
                                setShowNotifications(false);
                              }
                            }}
                            className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg p-1 sm:p-2 hover:bg-gray-100"
                >
                  <img
                    src={
                      user?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User",
                      )}&background=3b82f6&color=fff`
                    }
                    alt={user?.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <ChevronDown className="hidden sm:block h-4 w-4 text-gray-600" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 -ml-2"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mobile Search Results */}
          <div className="overflow-y-auto h-[calc(100vh-73px)]">
            {searchResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                {searchQuery ? "No results found" : "Start typing to search"}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSearchSelect(result.link)}
                    className="w-full px-4 py-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                          result.type === "project"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {result.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {result.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
