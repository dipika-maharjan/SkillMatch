import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";
import { logout } from "../services/api";
import LogoutModal from "./LogoutModal";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Briefcase, label: "Jobs", path: "/admin/jobs" },
    { icon: FileText, label: "Applications", path: "/admin/applications" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
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
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-indigo-900 to-indigo-800 text-white transition-all duration-300 hidden md:flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-indigo-700">
          <Link
            to="/"
            className={`font-bold text-lg whitespace-nowrap ${!sidebarOpen && "hidden"}`}
          >
            SkillMatch
          </Link>
          {!sidebarOpen && (
            <Link to="/" className="font-bold text-lg">
              SM
            </Link>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`${!sidebarOpen && "hidden"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={() => setShowConfirmLogout(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-700 w-full transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`${!sidebarOpen && "hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white transform transition-transform duration-300 z-50 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-indigo-700">
          <Link to="/" className="font-bold text-lg">
            SkillMatch
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={() => {
              setShowConfirmLogout(true);
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-700 w-full transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        showConfirmLogout={showConfirmLogout}
        showSuccessLogout={showSuccessLogout}
        onConfirm={handleLogout}
        onCancel={() => setShowConfirmLogout(false)}
        onReturnToLogin={handleReturnToLogin}
        onGoToHomepage={handleGoToHomepage}
      />
    </>
  );
}
