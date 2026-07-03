import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { logout } from "../services/api";
import LogoutModal from "./LogoutModal";

export default function ProfileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
      >
        <User className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <div className="p-4 bg-indigo-50/50 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {user?.fullname?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user?.fullname || "User"}</p>
            </div>
          </div>
          
          <div className="py-2">
            <Link
              to="/settings/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
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
