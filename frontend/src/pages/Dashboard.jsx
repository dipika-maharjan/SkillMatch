import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, ArrowRight, FileText, Menu } from "lucide-react";
import ProfileMenu from "../components/ProfileMenu";
import NotificationButton from "../components/NotificationButton";
import API, { getUnreadNotificationCount } from "../services/api";

const fallbackDashboard = {
  user: { fullname: "User" },
  stats: {
    resumeScore: 85,
    applications: 12,
    recommendations: 4,
    savedJobs: 8,
  },
  recommendations: [
    {
      role: "UI/UX Designer",
      company: "DesignHub",
      location: "Lalitpur, Nepal",
      match: 90,
    },
    {
      role: "Product Designer",
      company: "Tech Pvt. Ltd",
      location: "Kathmandu, Nepal",
      match: 88,
    },
    {
      role: "Frontend Developer",
      company: "Techno Company",
      location: "Biratnagar, Nepal",
      match: 84,
    },
  ],
  skills: [
    { skill: "Figma", percentage: 75 },
    { skill: "Prototyping", percentage: 80 },
    { skill: "UX Design", percentage: 70 },
    { skill: "Web Development", percentage: 80 },
  ],
  resume: {
    fileName: "User_Resume.pdf",
  },
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(fallbackDashboard);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (savedUser) {
        setDashboard((prev) => ({
          ...prev,
          user: savedUser,
        }));
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const res = await API.get("/dashboard");

        setDashboard((prev) => ({
          ...prev,
          ...res.data,
          user: res.data.user || prev.user,
          stats: { ...prev.stats, ...res.data.stats },
          recommendations: res.data.recommendations || prev.recommendations,
          skills: res.data.skills || prev.skills,
          resume: { ...prev.resume, ...res.data.resume },
        }));
      } catch {
        if (savedUser) {
          setDashboard((prev) => ({
            ...prev,
            user: savedUser,
          }));
        }
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await getUnreadNotificationCount();
        setUnreadCount(response.data?.unreadCount || 0);
      } catch (err) {
        console.error("Failed to load notification count", err);
      }
    };

    loadNotifications();
    window.addEventListener("focus", loadNotifications);
    return () => window.removeEventListener("focus", loadNotifications);
  }, []);

  const { user, stats, recommendations, skills, resume } = dashboard;

  const getImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:")) return value;
    const base = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    return `${base}${value.startsWith("/") ? value : `/${value}`}`;
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white/95 border-b border-slate-200 px-8 py-4 sticky top-0 z-40 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs, skills, companies..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <NotificationButton unreadCount={unreadCount} />
              <ProfileMenu user={user} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 sm:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.fullname || "User"}
            </h1>
            <p className="text-gray-600 text-sm">
              Here's what's happening with your profile today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {stats.resumeScore}%
              </p>
              <p className="text-gray-600 text-sm">Resume Score</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {stats.applications}
              </p>
              <p className="text-gray-600 text-sm">Applications</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {stats.recommendations}
              </p>
              <p className="text-gray-600 text-sm">Recommendations</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {stats.savedJobs}
              </p>
              <p className="text-gray-600 text-sm">Saved Jobs</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Top Job Matches */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Top Job Matches
                </h2>

                <div className="space-y-5">
                  {recommendations.map((job, index) => (
                    <div
                      key={`${job.role}-${job.company}`}
                      className="border border-slate-200 rounded-lg p-5 transition hover:border-indigo-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4 flex-1">
                          {job.companyLogo ? (
                            <img
                              src={getImageUrl(job.companyLogo)}
                              alt={job.company}
                              className="w-10 h-10 rounded-lg object-cover ring-1 ring-indigo-100"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-indigo-100">
                              <span className="text-indigo-600 font-bold text-sm">
                                {job.company?.charAt(0) || index + 1}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {job.role}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {job.company}
                            </p>
                            <p className="text-xs text-gray-500">
                              {job.location}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-500">
                          {job.match}% Match
                        </span>
                      </div>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="w-64 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>

                <Link
                  to="/jobs"
                  className="mt-6 text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 w-fit"
                >
                  View all jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column - Profile Summary & Resume */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Profile Summary
                </h2>

                <div className="space-y-4">
                  {skills.map((item) => (
                    <div key={item.skill}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {item.skill}
                        </p>
                        <p className="text-sm font-semibold text-indigo-600">
                          {item.percentage}%
                        </p>
                      </div>
                      <div className="w-64 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/settings/profile"
                  className="mt-6 text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 w-fit"
                >
                  View full profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Resume Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resume</h2>

                {resume ? (
                  <>
                    <a
                      href={resume.fileUrl ? getImageUrl(resume.fileUrl) : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center gap-3 border border-gray-100 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <FileText className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {resume.fileName}
                      </span>
                    </a>
                    <Link
                      to="/resume"
                      className="flex items-center justify-center w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2 rounded-lg transition"
                    >
                      Update Resume
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 py-6">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        No resume uploaded yet
                      </span>
                    </div>
                    <Link
                      to="/resume"
                      className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Upload Resume
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
