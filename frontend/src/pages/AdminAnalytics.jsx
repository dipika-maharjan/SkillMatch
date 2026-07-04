import { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#4f46e5", "#3b82f6", "#8b5cf6", "#ec4899"];

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(savedUser);
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      // Mock data for demonstration
      setAnalytics({
        dailyApplications: [
          { _id: "2024-01-01", count: 45 },
          { _id: "2024-01-02", count: 52 },
          { _id: "2024-01-03", count: 48 },
          { _id: "2024-01-04", count: 61 },
          { _id: "2024-01-05", count: 55 },
          { _id: "2024-01-06", count: 67 },
        ],
        jobsByCategory: [
          { _id: "Technology", count: 45 },
          { _id: "Finance", count: 32 },
          { _id: "Marketing", count: 28 },
          { _id: "Sales", count: 25 },
        ],
        applicationsByStatus: [
          { _id: "pending", count: 120 },
          { _id: "accepted", count: 65 },
          { _id: "rejected", count: 35 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">
                View detailed platform statistics
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Daily Applications Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Daily Applications
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.dailyApplications}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#4f46e5"
                        dot={{ fill: "#4f46e5" }}
                        name="Applications"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Jobs by Category */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Jobs by Category
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.jobsByCategory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" name="Jobs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Applications by Status */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Applications by Status
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.applicationsByStatus}
                          dataKey="count"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {analytics.applicationsByStatus.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Summary
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-sm text-indigo-600 font-medium">
                        Total Jobs Posted
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 mt-2">
                        {analytics.jobsByCategory.reduce(
                          (sum, item) => sum + item.count,
                          0,
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">
                        Total Applications
                      </p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">
                        {analytics.applicationsByStatus.reduce(
                          (sum, item) => sum + item.count,
                          0,
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600 font-medium">
                        Accepted Applications
                      </p>
                      <p className="text-2xl font-bold text-green-900 mt-2">
                        {analytics.applicationsByStatus.find(
                          (item) => item._id === "accepted",
                        )?.count || 0}
                      </p>
                    </div>
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
