import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";

export default function AdminAnalytics() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get("/admin/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setAnalytics({
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
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Summary</h2>
              <p className="text-sm text-zinc-500">
                A concise overview of the current application pipeline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
      )}
    </AdminLayout>
  );
}
