import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const statusTabs = [
  { key: "All", label: "All" },
  { key: "Applied", label: "Applied" },
  { key: "Shortlisted", label: "Shortlisted" },
  { key: "Interview", label: "Interview" },
  { key: "Rejected", label: "Rejected" },
];

const badgeClassMap = {
  Applied: "bg-emerald-100 text-emerald-700",
  Shortlisted: "bg-indigo-100 text-indigo-700",
  Interview: "bg-violet-100 text-violet-700",
  Rejected: "bg-rose-100 text-rose-700",
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await API.get("/applications/my");
        setApplications(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const counts = useMemo(() => {
    const data = {
      All: applications.length,
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Rejected: 0,
    };

    applications.forEach((application) => {
      const status = application.status || "Applied";
      if (data[status] !== undefined) {
        data[status] += 1;
      }
    });

    return data;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (activeTab === "All") {
      return applications;
    }
    return applications.filter(
      (application) => application.status === activeTab,
    );
  }, [activeTab, applications]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-slate-50 px-6 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              My Applications
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl">
              Track your job application progress with a clean status overview
              and live backend data.
            </p>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="inline-flex rounded-full bg-white border border-slate-200 p-1 shadow-sm">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    {counts[tab.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading applications...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
              {error}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              No applications found for this tab.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const job = application.job || {};
                const status = application.status || "Applied";
                const badgeClass =
                  badgeClassMap[status] ?? "bg-slate-100 text-slate-700";

                return (
                  <div
                    key={application._id}
                    className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700 text-lg font-semibold">
                            {String(job.company || application.jobTitle || "J")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-xl font-semibold text-slate-900 truncate">
                              {application.jobTitle || job.title}
                            </h2>
                            <p className="text-sm text-slate-500 truncate">
                              {application.company || job.company}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span>
                            Applied on{" "}
                            {new Date(
                              application.appliedAt,
                            ).toLocaleDateString()}
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-4 sm:items-end">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}
                        >
                          {status}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          Match {application.matchScore ?? 0}%
                        </span>
                        <Link
                          to={`/jobs/${job._id || application.job}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          View details
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
