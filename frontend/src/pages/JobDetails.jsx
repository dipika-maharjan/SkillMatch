import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Briefcase, Send } from "lucide-react";
import API from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await API.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load job details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!job) return;

    setApplying(true);
    setError("");
    setSuccess("");

    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      const payload = {
        userSkills: savedUser?.skills || ["react", "javascript", "ui"],
        resumeText: savedUser?.summary || "",
      };

      await API.post(`/applications/jobs/${job._id}/apply`, payload);
      setSuccess("Application submitted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to apply for this job",
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex">
      <div className="w-full min-h-screen bg-gray-50 px-6 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to jobs
          </Link>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center text-slate-500">
              Loading job details...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 shadow-sm text-center text-red-700">
              {error}
            </div>
          ) : !job ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center text-slate-500">
              Job not found.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-semibold text-indigo-600 uppercase tracking-[0.2em] mb-2">
                    {job.workType || "Job"}
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {job.title}
                  </h1>
                  <p className="text-base text-gray-600">{job.company}</p>
                </div>
                <div className="rounded-3xl bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700">
                  {new Date(job.postedAt || job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">
                    Location
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">
                    Experience
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Clock className="w-4 h-4" />
                    {job.experienceLevel || "Not specified"}
                  </div>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.18em] mb-2">
                    Category
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Briefcase className="w-4 h-4" />
                    {job.category || "General"}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send className="w-4 h-4" />
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                  <Link
                    to="/my-applications"
                    className="inline-flex items-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View My Applications
                  </Link>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Job Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {job.description || "No description available."}
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).length > 0 ? (
                      job.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        Not specified.
                      </span>
                    )}
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500 mb-2">Salary Range</p>
                    <p className="text-gray-800">
                      {job.salaryMin || 0} - {job.salaryMax || 0}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <p className="text-gray-800">
                      {job.isActive ? "Active" : "Closed"}
                    </p>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
