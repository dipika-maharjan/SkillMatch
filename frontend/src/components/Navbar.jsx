import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { getUnreadNotificationCount } from "../services/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (token && token !== "null" && token !== "undefined") {
        setIsAuthenticated(true);
        setUser(savedUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    const loadNotifications = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const res = await getUnreadNotificationCount();
        setUnreadCount(res.data?.unreadCount || 0);
      } catch (err) {
        console.error("Failed to load notification count", err);
      }
    };

    loadAuth();
    loadNotifications();

    const handleStorage = () => {
      loadAuth();
      loadNotifications();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", loadNotifications);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", loadNotifications);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold text-gray-900">
            SkillMatch
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/jobs"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Jobs
                </Link>
                <Link
                  to="/ai-assistant"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Assistant
                </Link>
              </>
            )}
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              How it Works
            </a>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              About
            </a>
          </nav>

          {/* Auth Buttons or Profile Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/settings/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-indigo-600"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <ProfileMenu user={user} />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
