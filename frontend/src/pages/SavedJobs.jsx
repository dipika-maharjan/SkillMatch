import Sidebar from "../components/Sidebar";
import { Heart, MapPin, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function SavedJobs() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filters = [
    { id: "all", label: "All", count: 0 },
    { id: "recent", label: "Recently Saved", count: null },
    { id: "match", label: "By Match", count: null },
    { id: "company", label: "By Company", count: null },
  ];

  const filteredJobs = useMemo(() => {
    let jobs = [...savedJobs];

    if (activeFilter === "recent") {
      jobs.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } else if (activeFilter === "match") {
      jobs.sort((a, b) => (b.match || 0) - (a.match || 0));
    } else if (activeFilter === "company") {
      jobs.sort((a, b) => a.company.localeCompare(b.company));
    }

    if (sortBy === "latest") {
      jobs.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } else if (sortBy === "match") {
      jobs.sort((a, b) => (b.match || 0) - (a.match || 0));
    }

    return jobs;
  }, [activeFilter, sortBy, savedJobs]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await API.get("/saved-jobs");
        setSavedJobs(
          (response.data.savedJobs || []).map((item) => ({
            ...item.job,
            savedAt: item.savedAt,
          })),
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load saved jobs",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const totalCount = savedJobs.length;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600 text-sm">Jobs you've saved for later.</p>
        </div>

        {/* Main Content */}
        <div className="px-6 sm:px-8 py-6">
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                    activeFilter === filter.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {filter.label}
                  {filter.count !== null && ` (${filter.count})`}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">{totalCount} saved jobs</div>
          </div>

          {/* Sort Bar */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm font-medium">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="recent">Recently Added</option>
                <option value="latest">Latest</option>
                <option value="match">Best Match</option>
              </select>
            </div>
          </div>

          {/* Saved Jobs List */}
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                Loading saved jobs...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
                {error}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                No saved jobs yet.
              </div>
            ) : (
              filteredJobs.map((job) => {
                const tags = [
                  job.workType,
                  job.experienceLevel,
                  job.category,
                  ...(job.skills || []),
                ].filter(Boolean);
                const savedDateText = job.savedAt
                  ? new Date(job.savedAt).toLocaleDateString()
                  : "Saved recently";
                const initial =
                  job.company?.trim().charAt(0).toUpperCase() || "J";

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-200 hover:border-indigo-200"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                          <span className="text-white text-lg font-bold">
                            {initial}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                            <span className="font-medium">{job.company}</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location || "Remote"}</span>
                            </div>
                            <span className="text-slate-500">
                              {savedDateText}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-3 sm:w-56">
                        <div className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 text-sm font-semibold">
                          {job.match !== undefined && job.match !== null ? `${job.match}% Match` : "Match unknown"}
                        </div>
                        <div className="flex w-full gap-3">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await API.delete(`/saved-jobs/${job._id}`);
                                setSavedJobs((prevJobs) =>
                                  prevJobs.filter(
                                    (item) => item._id !== job._id,
                                  ),
                                );
                              } catch (err) {
                                console.error(
                                  "Failed to remove saved job",
                                  err,
                                );
                              }
                            }}
                            className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          >
                            Remove
                          </button>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
