import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Upload,
  ChevronRight,
  Check,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import API from "../services/api";
import { getResume } from "../services/api";

export default function Apply() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [application, setApplication] = useState(null);
  const [resume, setResume] = useState(null);

  const steps = [
    { number: 1, label: "Application Info" },
    { number: 2, label: "Review" },
    { number: 3, label: "Submitted" },
  ];

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (!jobId) return;
      setLoading(true);
      setError("");

      try {
        const [jobResponse, resumeResponse] = await Promise.all([
          API.get(`/jobs/${jobId}`),
          getResume().catch(() => null),
        ]);

        setJob(jobResponse.data);
        setResume(resumeResponse?.data || null);
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

    fetchApplicationData();
  }, [jobId]);

  const reviewFields = useMemo(
    () => [
      { label: "Job", value: job?.title || "Loading..." },
      { label: "Company", value: job?.company || "Loading..." },
      { label: "Resume", value: resume?.fileName || "No resume uploaded" },
      { label: "Cover Letter", value: coverLetter || "Not provided" },
      { label: "Portfolio", value: portfolio || "Not provided" },
      { label: "LinkedIn", value: linkedin || "Not provided" },
    ],
    [job, resume, coverLetter, portfolio, linkedin],
  );

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);

    try {
      if (!resume) {
        setError("Upload a resume first before submitting this application.");
        setSubmitting(false);
        return;
      }

      const response = await API.post(`/applications/jobs/${jobId}/apply`, {
        coverLetter,
        resumeUrl: resume.fileUrl || "",
        userSkills: resume.skills || [],
        resumeText: resume.rawText || "",
      });
      setApplication(response.data);
      setCurrentStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm text-gray-600">
          Loading application details...
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="rounded-3xl bg-red-50 border border-red-200 p-10 shadow-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Apply for {job?.title || "this role"}
          </h1>
          <p className="text-gray-600 text-sm">
            Complete your application and review before submission.
          </p>
        </div>

        <div className="flex justify-center items-center gap-8 mb-12">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition ${
                    currentStep >= step.number
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <p className="text-xs font-medium text-gray-900 mt-2 text-center">
                  {step.label}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-1 w-12 rounded-full transition ${
                    currentStep > step.number ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {!job ? null : (
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
            {currentStep === 1 && (
              <>
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50">
                      <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 mt-1">{job.company}</p>
                      <p className="text-sm text-gray-500 mt-3">
                        {job.location || "Remote"} · {job.workType || "N/A"} ·{" "}
                        {job.experienceLevel || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-2xl p-5 bg-indigo-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Resume selected
                        </p>
                        <p className="text-sm text-gray-500">
                          {resume?.fileName || "No resume uploaded"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your latest saved resume will be attached to the
                      application.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Cover Letter
                      <span className="text-gray-500"> (Optional)</span>
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) =>
                        setCoverLetter(e.target.value.slice(0, 500))
                      }
                      rows={6}
                      placeholder="Why are you a great fit for this role?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {coverLetter.length}/500 characters
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">
                        Portfolio URL{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://"
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">
                        LinkedIn Profile{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Back to job
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="ml-auto px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    Review application
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Review your application
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Confirm the details below before submitting to {job.company}
                    .
                  </p>
                </div>

                <div className="space-y-4">
                  {reviewFields.map((field) => (
                    <div
                      key={field.label}
                      className="rounded-2xl border border-gray-200 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {field.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {field.value === "Not provided" ? "Optional" : ""}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-3 whitespace-pre-wrap">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Edit details
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="ml-auto px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Submitting..." : "Submit application"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="text-center py-16">
                <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Application submitted
                </h2>
                <p className="text-gray-600 mb-8">
                  Your application for {job.title} at {job.company} has been
                  sent. You can view it in your application history.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/my-applications")}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                  >
                    View my applications
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/jobs")}
                    className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Continue browsing jobs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
