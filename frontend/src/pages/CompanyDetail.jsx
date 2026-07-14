import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Briefcase,
  Building2,
  Sparkles,
} from "lucide-react";
import API from "../services/api";

const formatCompanyName = (company = "") => decodeURIComponent(company);

export default function CompanyDetail() {
  const navigate = useNavigate();
  const { company } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await API.get("/jobs", {
          params: { search: formatCompanyName(company), limit: 20 },
        });
        setJobs(response.data.jobs || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load company details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (company) {
      fetchCompanyJobs();
    }
  }, [company]);

  const companyName = formatCompanyName(company);
  const companyJobs = jobs.filter((jobItem) => jobItem.company === companyName);
  const companyInfo = companyJobs[0] || {};
  const companyDescription =
    companyInfo.companyDescription ||
    companyInfo.description ||
    `Explore open roles and company details for ${companyName}.`;
  const companyWebsite = companyInfo.companyWebsite || companyInfo.website;
  const industry = companyInfo.category || "Design Software";
  const location = companyInfo.location || "Lalitpur, Nepal";
  const remoteFriendly = companyInfo.workType !== "On-site";

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm text-gray-600 border border-gray-200">
          Loading company details...
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {companyInfo.companyLogo ? (
                  <img
                    src={companyInfo.companyLogo}
                    alt={companyName}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">
                      {companyName.charAt(0) || "C"}
                    </div>
                    <div className="text-xs font-semibold text-indigo-600">
                      {companyName.slice(1, 2) || ""}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {companyName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    {remoteFriendly ? "Remote Friendly" : "On-site Focused"}
                  </span>
                </div>
                <p className="text-sm font-medium text-indigo-600 mb-3">
                  {industry}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {companyJobs.length} open roles
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
              <a
                href={companyWebsite || "#"}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  companyWebsite
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Industry", value: industry },
              { label: "Location", value: location },
              {
                label: "Work Style",
                value: remoteFriendly ? "Remote Friendly" : "On-site Focused",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About {companyName}
              </h2>
              <div className="space-y-4 text-sm leading-7 text-gray-700">
                <p>{companyDescription}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Company Snapshot
                </h2>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Industry
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">{industry}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Location
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">{location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Work Style
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {remoteFriendly ? "Remote Friendly" : "On-site Focused"}
                  </p>
                </div>
                {companyWebsite && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Website
                    </p>
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Visit website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Open Positions
              </h2>
              <p className="text-sm text-slate-500">
                Current openings at {companyName}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {companyJobs.length} listings
            </span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading open positions...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : companyJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                No open roles are available for this company right now.
              </div>
            ) : (
              companyJobs.map((jobItem) => (
                <Link
                  key={jobItem._id}
                  to={`/jobs/${jobItem._id}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white flex-shrink-0">
                      {jobItem.title?.charAt(0) ?? "J"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-gray-900">
                        {jobItem.title}
                      </h3>
                      <p className="truncate text-sm text-gray-600">
                        {jobItem.workType || "Full-time"} •{" "}
                        {jobItem.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">
                    View Job
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
