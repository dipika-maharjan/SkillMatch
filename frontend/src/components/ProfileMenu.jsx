import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { logout } from "../services/api";
import LogoutModal from "./LogoutModal";

export default function ProfileMenu({ user: initialUser }) {
  const [localUser, setLocalUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : initialUser;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowConfirmLogout(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowConfirmLogout(false);
      setShowSuccessLogout(true);
    }
  };

  const handleReturnToLogin = () => {
    setShowSuccessLogout(false);
    navigate("/login");
  };

  const handleGoToHomepage = () => {
    setShowSuccessLogout(false);
    navigate("/");
  };

  const initials = (localUser?.fullname || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc = (() => {
    const raw = localUser?.avatarUrl || "";
    if (!raw) return "";
    if (raw.startsWith("data:")) return raw;
    if (raw.startsWith("http")) return raw;
    const base = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border border-slate-200 bg-white p-1 shadow-sm transition hover:shadow-md"
        aria-label="Open profile menu"
      >
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-semibold text-white ring-2 ring-white">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={localUser?.fullname || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg z-50">
          <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-semibold text-white ring-2 ring-white">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={localUser?.fullname || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {localUser?.fullname || "User"}
                </p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
            </div>

            <Link
              to="/ai-assistant"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles className="h-4 w-4" />
              Open AI Assistant
            </Link>
          </div>

          <div className="py-2">
            <Link
              to="/settings/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="py-2 border-t border-gray-100">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <LogoutModal
        showConfirmLogout={showConfirmLogout}
        showSuccessLogout={showSuccessLogout}
        onConfirm={confirmLogout}
        onCancel={() => setShowConfirmLogout(false)}
        onReturnToLogin={handleReturnToLogin}
        onGoToHomepage={handleGoToHomepage}
      />
    </div>
  );
}
