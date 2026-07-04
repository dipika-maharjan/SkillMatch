import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";
import DashboardStats from "../components/admin/DashboardStats";
import RecentActivity from "../components/admin/RecentActivity";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    // Check if user is admin (you may need to add role checking)
    setUser(savedUser);
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/stats");
      setStats(response.data);
      setRecentActivity(response.data.recentActivity || []);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
            </div>

            {/* Stats Overview */}
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ) : (
              <>
                <DashboardStats stats={stats} />

                {/* Recent Activity */}
                <div className="mt-8">
                  <RecentActivity activities={recentActivity} />
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => navigate("/admin/jobs")}
                      className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-indigo-600"
                    >
                      <Briefcase className="w-8 h-8 text-indigo-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">
                        Manage Jobs
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add, edit, or delete jobs
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-600"
                    >
                      <FileText className="w-8 h-8 text-blue-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">
                        Applications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Review and manage applications
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/admin/users")}
                      className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-purple-600"
                    >
                      <Users className="w-8 h-8 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Users</h3>
                      <p className="text-sm text-gray-600">
                        Manage user accounts
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/admin/settings")}
                      className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-gray-600"
                    >
                      <Settings className="w-8 h-8 text-gray-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Settings</h3>
                      <p className="text-sm text-gray-600">
                        System configuration
                      </p>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
