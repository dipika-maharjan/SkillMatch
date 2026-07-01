import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Heart,
  Laptop,
  Clock,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import API from "../services/api";

const benefits = [
  { icon: Heart, label: "Health Insurance" },
  { icon: Laptop, label: "Remote Work" },
  { icon: Clock, label: "Flexible Hours" },
  { icon: TrendingUp, label: "Learning Support" },
];

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
        const fetchedJobs = response.data.jobs || [];
        setJobs(fetchedJobs);
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
  const companyDescription = companyInfo.description
    ? companyInfo.description
    : `Explore open roles and company details for ${companyName}.`;
  const industry = companyInfo.category || "Design Software";
  const location = companyInfo.location || "Lalitpur, Nepal";
  const remoteFriendly = companyInfo.workType !== "On-site";

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to job detail
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {companyName.charAt(0) || "C"}
                </div>
                <div className="text-xs text-blue-600">
                  {companyName.slice(1, 2) || ""}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {companyName}
              </h1>
              <p className="text-gray-600 text-sm mb-3">{industry}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {location}
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {remoteFriendly ? "Remote Friendly" : "On-site Focused"}
                </span>
              </div>
            </div>

            <a
              href={companyInfo.website || "#"}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition flex-shrink-0 ${
                companyInfo.website
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {companyName}
              </h2>
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>{companyDescription}</p>
                {companyInfo.description && <p>{companyInfo.description}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Culture & Benefits
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-900 leading-tight">
                        {benefit.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Our Team</h2>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">
                  View All
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3 -space-x-2">
                {[
                  { bg: "bg-red-500", initial: "A" },
                  { bg: "bg-blue-500", initial: "B" },
                  { bg: "bg-purple-500", initial: "C" },
                  { bg: "bg-green-500", initial: "D" },
                ].map((member, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 ${member.bg} rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white`}
                  >
                    {member.initial}
                  </div>
                ))}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white">
                  +10
                </div>
              </div>
              <p className="text-xs text-gray-600">
                10 passionate designers and creators pushing boundaries
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Open Positions
              </h2>
              <p className="text-sm text-slate-500">
                Current openings at {companyName}
              </p>
            </div>
            <span className="text-indigo-600 font-semibold text-sm">
              {companyJobs.length} Listings
            </span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading open positions...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : companyJobs.length === 0 ? (
              <p className="text-sm text-gray-500">
                No open roles available yet.
              </p>
            ) : (
              companyJobs.map((jobItem) => (
                <Link
                  key={jobItem._id}
                  to={`/jobs/${jobItem._id}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-3xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {jobItem.title?.charAt(0) ?? "J"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {jobItem.title}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {jobItem.workType || "Full-time"} •{" "}
                        {jobItem.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <span className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm whitespace-nowrap">
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
