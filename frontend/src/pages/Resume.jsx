import Sidebar from "../components/Sidebar";
import {
  CheckCircle,
  ChevronRight,
  Link as LinkIcon,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteResume, getResume, uploadResume } from "../services/api";

export default function Resume() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedResume, setSavedResume] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await getResume();
        setSavedResume(response.data);
      } catch (loadError) {
        if (loadError.response?.status !== 404) {
          console.error("Failed to load saved resume", loadError);
        }
      }
    };

    loadResume();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5MB");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await uploadResume(file);
      setSavedResume(response.data.resume);
      navigate("/resume-analysis?modal=true");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveResume = async () => {
    if (!savedResume) return;

    setLoading(true);
    setError("");

    try {
      await deleteResume();
      setSavedResume(null);
    } catch (removeError) {
      setError(
        removeError.response?.data?.message ||
          "Failed to remove resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const currentFileName = savedResume?.fileName || "No resume uploaded yet";

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#f7f7fb]">
        <div className="px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-medium text-slate-600">Resume</h1>
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-12 sm:px-8">
          <section className="rounded-[28px] bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Upload Resume
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload your latest resume and let our AI analyze it for better
                job matches.
              </p>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`mx-auto max-w-md rounded-[22px] border-2 border-dashed p-10 text-center transition sm:p-12 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-indigo-300 bg-white"
              }`}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                <Upload className="h-7 w-7" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Drag & drop your resume here
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Supports PDF, DOCX up to 5MB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Choose File"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Your data is secure and private. We never share your resume.
            </p>

            {savedResume && (
              <div className="mx-auto mt-5 max-w-md rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      Current file:
                    </p>
                    <p className="truncate font-medium text-slate-900">
                      {currentFileName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    disabled={loading}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Remove resume"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/resume-analysis")}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Go to Resume Analysis
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {error && (
              <div className="mx-auto mt-5 max-w-md rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          <section className="mt-8 max-w-md rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="text-base font-semibold text-slate-900">
              Tips for a Better Analysis
            </h3>
            <div className="mt-4 space-y-4">
              {[
                {
                  icon: CheckCircle,
                  title: "Use a clean and updated resume",
                  desc: "Ensure your resume is up to date and easy to read.",
                },
                {
                  icon: LinkIcon,
                  title: "Include your key skills",
                  desc: "Highlight the skills that match your target role.",
                },
                {
                  icon: CheckCircle,
                  title: "Highlight achievements",
                  desc: "Show results, impact, and measurable outcomes.",
                },
                {
                  icon: CheckCircle,
                  title: "Keep it concise",
                  desc: "A well-organized resume of 1-2 pages works best.",
                },
              ].map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.title} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {tip.title}
                      </p>
                      <p className="text-xs text-slate-500">{tip.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
