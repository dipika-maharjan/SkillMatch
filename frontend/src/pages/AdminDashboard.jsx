import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Users } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import DashboardStats from "../components/admin/DashboardStats";
import RecentActivity from "../components/admin/RecentActivity";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
      setRecentActivity(response.data.recentActivity || []);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    const timer = window.setTimeout(fetchDashboardStats, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboardStats, navigate, user]);

  const quickActions = [
    {
      label: "Manage Jobs",
      description: "Create postings and keep openings current.",
      path: "/admin/jobs",
      icon: Briefcase,
      accent: "text-teal-700",
    },
    {
      label: "Review Applications",
      description: "Move candidates through pending, accepted, and rejected.",
      path: "/admin/applications",
      icon: FileText,
      accent: "text-sky-700",
    },
    {
      label: "User Accounts",
      description: "Check roles and remove accounts when needed.",
      path: "/admin/users",
      icon: Users,
      accent: "text-violet-700",
    },
  ];

  return (
    <AdminLayout
      user={user}
      title="Dashboard"
      description={`Welcome back, ${user?.name || user?.fullname || "admin"}.`}
    >
      {loading ? (
        <div className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 rounded-lg bg-zinc-200" />
          ))}
        </div>
      ) : (
        <>
          <DashboardStats stats={stats} />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <RecentActivity activities={recentActivity} />

            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-950">
                Quick Actions
              </h2>
              <div className="mt-4 space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`mt-0.5 h-5 w-5 ${action.accent}`} />
                        <div>
                          <p className="font-semibold text-zinc-950">
                            {action.label}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-zinc-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
