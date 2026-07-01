import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
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

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-50 px-6 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 text-sm">
            Track the jobs you have applied to and their current status.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading applications...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            You have not applied to any jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const job = application.job || {};
              return (
                <div
                  key={application._id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {application.jobTitle || job.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {application.company || job.company}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied on{" "}
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                        {application.status}
                      </span>
                      <span className="text-sm font-semibold text-emerald-600">
                        Match {application.matchScore || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/jobs/${job._id || application.job}`}
                      className="text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
