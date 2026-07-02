import Sidebar from "../components/Sidebar";
import {
  ArrowLeft,
  Download,
  Upload,
  Check,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getResume, getResumeAnalysis } from "../services/api";

const fallbackAnalysis = {
  matchedSkills: {
    count: 12,
    percentage: 75,
    list: [
      "Figma",
      "UI Design",
      "Prototyping",
      "User Research",
      "Wireframing",
      "Interaction Design",
      "HTML",
      "CSS",
      "Design Systems",
      "UX Writing",
    ],
  },
  missingSkills: {
    count: 5,
    percentage: 25,
    list: [
      "Information Architecture",
      "Accessibility",
      "SEO Basics",
      "Analytics",
      "Testing",
    ],
  },
  skillBreakdown: [
    { skill: "UI Design", percentage: 90, proficiency: "Strong" },
    { skill: "Figma", percentage: 85, proficiency: "Strong" },
    { skill: "Prototyping", percentage: 80, proficiency: "Strong" },
    { skill: "Interaction Design", percentage: 50, proficiency: "Average" },
    { skill: "HTML/CSS", percentage: 30, proficiency: "Weak" },
  ],
  suggestions: [
    "Add more details about your projects and outcomes.",
    "Include metrics to showcase your impact.",
    "Consider adding more relevant keywords.",
  ],
  areasToImprove: [
    { area: "Information Architecture", severity: "LOW" },
    { area: "Accessibility", severity: "LOW" },
    { area: "SEO Basics", severity: "NOT FOUND" },
    { area: "Analytics", severity: "LOW" },
  ],
};

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [resume, setResume] = useState(null);

  const jobId = searchParams.get("jobId");
  const analysis = analysisResponse?.analysis || fallbackAnalysis;
  const scoreFromApi =
    typeof analysisResponse?.matchScore === "number"
      ? analysisResponse.matchScore
      : 85;
  const score = jobId ? scoreFromApi : scoreFromApi || 85;

  const scoreLabel =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Average"
          : "Needs Improvement";

  const getSeverityClass = (severity) => {
    if (severity === "NOT FOUND") return "text-red-500";
    if (severity === "LOW") return "text-orange-500";
    if (severity === "MEDIUM") return "text-amber-500";
    return "text-emerald-500";
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [analysisResult, resumeResult] = await Promise.all([
          getResumeAnalysis(jobId || undefined),
          getResume().catch(() => null),
        ]);

        setAnalysisResponse(analysisResult.data);
        setResume(resumeResult?.data || analysisResult.data.resume);

        if (searchParams.get("modal") === "true") {
          setShowSuccessModal(true);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load resume analysis",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId, searchParams]);

  const reportData = useMemo(() => {
    const matched = analysis.matchedSkills || fallbackAnalysis.matchedSkills;
    const missing = analysis.missingSkills || fallbackAnalysis.missingSkills;
    const suggestions = analysis.suggestions || fallbackAnalysis.suggestions;
    const skillBreakdown =
      analysis.skillBreakdown || fallbackAnalysis.skillBreakdown;

    return {
      fileName: resume?.fileName || "CV.pdf",
      score,
      scoreLabel,
      matched,
      missing,
      suggestions,
      skillBreakdown,
    };
  }, [analysis, resume, score, scoreLabel]);

  const handleDownloadReport = () => {
    const lines = [
      "Resume Analysis Report",
      "======================",
      "",
      `File: ${reportData.fileName}`,
      `Match Score: ${reportData.score}/100`,
      `Level: ${reportData.scoreLabel}`,
      "",
      `Matched Skills: ${reportData.matched.list?.join(", ") || "N/A"}`,
      `Missing Skills: ${reportData.missing.list?.join(", ") || "N/A"}`,
      "",
      "Skill Breakdown:",
      ...(reportData.skillBreakdown || []).map(
        (item) => `${item.skill}: ${item.percentage}%`,
      ),
      "",
      "Suggestions:",
      ...(reportData.suggestions || []).map((item) => `- ${item}`),
    ];

    const reportContent = lines.join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(reportContent)}`,
    );
    element.setAttribute("download", "resume_analysis_report.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowSuccessModal(true);
  };

  const handleOpenResume = () => navigate("/resume");

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen bg-[#f7f7fb] flex items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading your resume analysis...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen bg-[#f7f7fb] p-8">
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            <p className="text-center text-red-600">{error}</p>
            <button
              onClick={handleOpenResume}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Back to resume
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#f7f7fb]">
        <div className="px-6 py-5 sm:px-8">
          <button
            onClick={handleOpenResume}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to resume
          </button>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12 sm:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Resume Analysis
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Here's how your resume looks and how you can improve it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
              <button
                onClick={handleOpenResume}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Upload className="h-4 w-4" />
                Re-upload Resume
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Match Score</h2>
              <div className="mt-5 flex items-center gap-6">
                <div className="flex min-w-[100px] flex-col items-center justify-center text-center">
                  <div
                    className={`text-5xl font-bold ${score >= 80 ? "text-emerald-500" : score >= 60 ? "text-sky-500" : score >= 40 ? "text-amber-500" : "text-rose-500"}`}
                  >
                    {score}
                  </div>
                  <div className="text-xs text-slate-500">/100</div>
                  <div className="text-sm font-medium text-emerald-500">
                    {scoreLabel}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-6 text-slate-600">
                    Great job! Your resume is strong and aligns well with the
                    job requirements.
                  </p>
                  <button className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                    View Full Report
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Skills Overview
              </h2>
              <div className="mt-5 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Matched Skills ({reportData.matched.count})
                    </span>
                    <span className="font-semibold text-emerald-500">
                      {reportData.matched.percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-400"
                      style={{ width: `${reportData.matched.percentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Missing Skills ({reportData.missing.count})
                    </span>
                    <span className="font-semibold text-amber-500">
                      {reportData.missing.percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-amber-400"
                      style={{ width: `${reportData.missing.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Top Matched Skills
              </h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {(reportData.matched.list || []).slice(0, 10).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Suggestions to Improve
              </h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {(reportData.suggestions || []).slice(0, 3).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm lg:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Skill Breakdown
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Strong
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Average
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Weak
                  </span>
                </div>
              </div>
              <div className="space-y-5">
                {reportData.skillBreakdown.map((item) => (
                  <div key={item.skill}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {item.skill}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${item.proficiency === "Strong" ? "bg-emerald-400" : item.proficiency === "Average" ? "bg-amber-400" : "bg-rose-400"}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-900">
                Areas to Improve
              </h2>
              <div className="mt-5 space-y-4">
                {(
                  analysis.areasToImprove || fallbackAnalysis.areasToImprove
                ).map((item) => (
                  <div
                    key={item.area}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700">{item.area}</span>
                    <span
                      className={`text-xs font-semibold ${getSeverityClass(item.severity)}`}
                    >
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Report Downloaded Successfully
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Your detailed resume analysis report has been saved to your
                device.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
