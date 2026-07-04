import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ArrowLeft, Sparkles, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EnhancedResumeFeedback() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResponse("");

    if (!resumeText.trim()) {
      setError("Please paste your resume text to get feedback.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/resume-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to get resume feedback.");
      }

      setResponse(data.response);
    } catch (err) {
      setError(err.message || "Failed to get resume feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#f7f7fb] p-6 lg:p-10">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Resume Feedback
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Paste your resume content below and get concise feedback on
                strengths, improvements, and missing skills.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Paste your resume text
                  </h2>
                  <p className="text-sm text-slate-500">
                    Keep it under 1500 characters for the best cost-efficient
                    evaluation.
                  </p>
                </div>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[260px] w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Paste your resume text here..."
              />
            </div>

            {error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Analyzing..." : "Get Feedback"}
            </button>
          </form>

          <div className="mt-10 rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                AI Feedback
              </h2>
            </div>
            {response ? (
              <div className="whitespace-pre-line text-sm leading-7 text-slate-800">
                {response}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Your feedback will appear here once the analysis is complete.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
