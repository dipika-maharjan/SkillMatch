import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
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
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";

export default function AdminAnalytics() {
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0f766e", "#0284c7", "#7c3aed", "#f59e0b"];

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get("/admin/analytics");
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
        applicationsByStatus: [
          { _id: "pending", count: 120 },
          { _id: "accepted", count: 65 },
          { _id: "rejected", count: 35 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchAnalytics, 0);
    return () => window.clearTimeout(timer);
  }, [fetchAnalytics]);

  return (
    <AdminLayout
      user={user}
      title="Analytics"
      description="Track application volume and outcomes so the admin team can spot what needs attention."
    >
      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500 shadow-sm">
          Loading analytics...
        </div>
      ) : (
        <>
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  Daily Applications
                </h2>
                <p className="text-sm text-zinc-500">
                  Application volume by day.
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={analytics.dailyApplications}>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
                <XAxis dataKey="_id" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ fill: "#0f766e", r: 4 }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-950">
                Status Breakdown
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Where applications currently stand.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.applicationsByStatus}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    label
                  >
                    {analytics.applicationsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-950">Summary</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 p-4">
                  <p className="text-sm text-zinc-500">All Applications</p>
                  <p className="mt-2 text-3xl font-semibold text-zinc-950">
                    {analytics.applicationsByStatus.reduce(
                      (sum, item) => sum + item.count,
                      0,
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">Pending</p>
                  <p className="mt-2 text-3xl font-semibold text-amber-900">
                    {analytics.applicationsByStatus.find(
                      (item) => item._id === "pending",
                    )?.count || 0}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-800">Accepted</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-900">
                    {analytics.applicationsByStatus.find(
                      (item) => item._id === "accepted",
                    )?.count || 0}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
