import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { Search, Sliders, MapPin, Clock, Bookmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import SaveJobPopup from "../components/SaveJobPopup";

const categoryOptions = [
  "All",
  "Design",
  "Development",
  "Marketing",
  "Sales",
  "Product",
  "Data",
  "Other",
];
const experienceOptions = ["All", "Entry Level", "Mid Level", "Senior Level"];
const workTypeOptions = [
  { id: "all", label: "All" },
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "On-site" },
];

export default function Jobs() {
  const [workType, setWorkType] = useState("all");
  const [category, setCategory] = useState("All");
  const [experienceLevel, setExperienceLevel] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevant");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);

  const getImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:")) return value;
    const base = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    return `${base}${value.startsWith("/") ? value : `/${value}`}`;
  };
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showSavePopup, setShowSavePopup] = useState(false);

  const activeWorkType =
    workType === "remote"
      ? "Remote"
      : workType === "onsite"
        ? "On-site"
        : workType === "hybrid"
          ? "Hybrid"
          : undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const loadJobs = async () => {
      const loadingMore = page > 1;
      if (loadingMore) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const params = { page, limit: 8, sortBy };
        if (search) params.search = search;
        if (workType !== "all") params.workType = activeWorkType;
        if (category !== "All") params.category = category;
        if (experienceLevel !== "All") params.experienceLevel = experienceLevel;

        const response = await API.get("/jobs", { params });
        const incomingJobs = response.data.jobs || [];
        setJobs((prevJobs) =>
          page === 1 ? incomingJobs : [...prevJobs, ...incomingJobs],
        );
        setTotalJobs(response.data.totalJobs || 0);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load jobs",
        );
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    loadJobs();
  }, [search, activeWorkType, category, experienceLevel, page, sortBy]);

  useEffect(() => {
    const loadSavedIds = async () => {
      try {
        const response = await API.get("/saved-jobs/ids");
        setSavedJobIds(response.data.jobIds || []);
      } catch (err) {
        // ignore saved id load failure for now
      }
    };

    loadSavedIds();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-slate-50 min-h-screen">
        <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600 text-sm">
            Browse opportunities that match your skills and interests.
          </p>
        </div>

        <div className="px-6 sm:px-8 py-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search jobs, skills, companies..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((open) => !open)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 font-medium text-sm whitespace-nowrap transition"
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full z-30 mt-3 w-[24rem] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80">
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          Category
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {categoryOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setCategory(option);
                                setPage(1);
                              }}
                              className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === option
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                                }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          Experience Level
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {experienceOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setExperienceLevel(option);
                                setPage(1);
                              }}
                              className={`rounded-full px-4 py-2 text-sm font-medium transition ${experienceLevel === option
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                                }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          Work Type
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {workTypeOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setWorkType(option.id);
                                setPage(1);
                              }}
                              className={`rounded-full px-4 py-2 text-sm font-medium transition ${workType === option.id
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setCategory("All");
                            setExperienceLevel("All");
                            setWorkType("all");
                            setPage(1);
                          }}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFilterOpen(false)}
                          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {category !== "All" && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Category: {category}
              </span>
            )}
            {experienceLevel !== "All" && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Experience: {experienceLevel}
              </span>
            )}
            {workType !== "all" && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Work Type: {activeWorkType}
              </span>
            )}
            {category === "All" &&
              experienceLevel === "All" &&
              workType === "all" && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Showing all jobs
                </span>
              )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-gray-600 text-sm font-medium">
              Showing {totalJobs} jobs
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="relevant">Most Relevant</option>
                <option value="latest">Latest</option>
                <option value="match">Best Match</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loading && page === 1 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-slate-500">
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-slate-500">
                No jobs found.
              </div>
            ) : (
              jobs.map((job) => {
                const createdAt = job.createdAt || job.postedAt;
                let postedDays = "Recently posted";
                if (createdAt) {
                  const postedDate = new Date(createdAt);
                  const diffDays = Math.floor(
                    (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24),
                  );
                  postedDays =
                    diffDays <= 0
                      ? "Today"
                      : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                }

                const tags = [
                  job.workType,
                  job.experienceLevel,
                  job.category,
                  ...(job.skills || []),
                ].filter(Boolean);
                const initial =
                  job.company?.trim().charAt(0).toUpperCase() || "J";

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border border-slate-200 hover:border-indigo-200"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200 overflow-hidden bg-indigo-50">
                        {job.companyLogo ? (
                          <img
                            src={getImageUrl(job.companyLogo)}
                            alt={job.company}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-white font-bold text-lg">
                            {initial}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <div className="text-center">
                            <p className="text-lg font-bold text-emerald-500">
                              {job.match !== undefined && job.match !== null
                                ? `${job.match}%`
                                : "0%"}
                            </p>
                            <p className="text-xs text-gray-500 font-semibold">
                              MATCH
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const isSaved = savedJobIds.includes(job._id);
                                if (isSaved) {
                                  await API.delete(`/saved-jobs/${job._id}`);
                                  setSavedJobIds((ids) =>
                                    ids.filter((id) => id !== job._id),
                                  );
                                } else {
                                  await API.post(`/saved-jobs/${job._id}`);
                                  setSavedJobIds((ids) => [...ids, job._id]);
                                  setShowSavePopup(true);
                                }
                              } catch (err) {
                                console.error("Save toggle failed", err);
                              }
                            }}
                            className={`p-2 rounded-lg transition ${savedJobIds.includes(job._id)
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "border border-slate-200 bg-white text-slate-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              }`}
                          >
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 mb-3">
                          <span className="font-medium truncate">
                            {job.company}
                          </span>
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{postedDays}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/jobs/${job._id}`}
                          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition text-sm shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {page < totalPages && (
            <div className="text-center mt-8">
              <button
                className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg transition"
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading more..." : "Load More Jobs"}
              </button>
            </div>
          )}
        </div>
      </main>

      <SaveJobPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
      />
    </div>
  );
}
