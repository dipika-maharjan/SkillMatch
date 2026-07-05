import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import API from "../services/api";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const formatSalary = (min, max) => {
  if (!min && !max) return "Not specified";
  if (!max) return `₹${min} LPA`;
  return `₹${min} - ${max} LPA`;
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSavePopup, setShowSavePopup] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const [jobResponse, savedResponse] = await Promise.all([
          API.get(`/jobs/${id}`),
          API.get("/saved-jobs/ids"),
        ]);

        setJob(jobResponse.data);
        setSavedJobIds(savedResponse.data.jobIds || []);
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

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm text-gray-600">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="rounded-3xl bg-red-50 border border-red-200 p-10 shadow-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm text-gray-700">
          Job not found.
        </div>
      </div>
    );
  }

  const postedAt = formatDate(job.postedAt || job.createdAt);
  const matchPercent = job.skills?.length
    ? Math.min(100, 50 + job.skills.length * 5)
    : 90;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </button>
      </div>

      {showSavePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Job Saved Successfully
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              This job has been added to your saved jobs list.
            </p>
            <button
              onClick={() => {
                setShowSavePopup(false);
                navigate("/saved-jobs");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Go to Saved Jobs
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            {job.jobImage ? (
              <img
                src={job.jobImage}
                alt={job.title}
                className="h-20 w-28 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-8 h-8 text-indigo-700" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {job.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location || "Remote"}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.workType || "N/A"}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {job.experienceLevel || "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Posted
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {postedAt}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Applicants
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {job.applicantsCount ?? "120+"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Experience
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {job.experienceLevel || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Salary
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex-shrink-0">
              <p className="text-3xl font-bold text-emerald-600">
                {matchPercent}%
              </p>
              <p className="text-xs text-emerald-600 font-semibold">MATCH</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const isSaved = savedJobIds.includes(job._id);
                  if (isSaved) {
                    await API.delete(`/saved-jobs/${job._id}`);
                    setSavedJobIds((ids) => ids.filter((id) => id !== job._id));
                  } else {
                    await API.post(`/saved-jobs/${job._id}`);
                    setSavedJobIds((ids) => [...ids, job._id]);
                    setShowSavePopup(true);
                  }
                } catch (err) {
                  console.error("Save toggle failed", err);
                }
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
                savedJobIds.includes(job._id)
                  ? "border-2 border-indigo-600 bg-indigo-600 text-white"
                  : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {savedJobIds.includes(job._id) ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => navigate(`/resume-analysis?jobId=${job._id}`)}
              className="flex items-center gap-2 px-6 py-2.5 border-2 border-cyan-200 bg-cyan-50 text-cyan-700 font-semibold rounded-lg transition hover:bg-cyan-100"
            >
              Resume Match
            </button>
            <button
              onClick={() => navigate(`/apply/${job._id}`)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              Apply Now
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>{job.description || "No job description provided."}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Requirements
              </h2>
              <div className="space-y-4">
                {(job.skills?.length
                  ? job.skills
                  : ["No specific requirements listed."]
                ).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {(job.skills || []).length > 0 ? (
                  job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                    No specific skills listed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Company</h2>

              <div className="flex items-center gap-3 mb-4">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="h-12 w-12 rounded-lg border border-gray-200 object-contain p-1"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{job.company}</h3>
                  <p className="text-xs text-gray-600">
                    {job.category || "Company"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {job.location || "Remote"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div>
                  <p className="text-gray-600">Industry</p>
                  <p className="font-semibold text-gray-900">
                    {job.category || "Technology"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Size</p>
                  <p className="font-semibold text-gray-900">
                    {job.companySize || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">
                    {job.location || "Remote"}
                  </p>
                </div>
              </div>

              <Link
                to={`/company/${encodeURIComponent(job.company)}`}
                className="w-full inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
              >
                View company profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
