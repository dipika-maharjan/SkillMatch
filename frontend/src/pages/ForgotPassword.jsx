import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!feedback.message) return;

    const timer = setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setFeedback({ type: "error", message: "Please enter your email." });
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setFeedback({ type: "error", message: "Enter a valid email address." });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const res = await API.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setFeedback({
        type: "success",
        message: res.data?.message || "Reset email sent.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !email.trim();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="grid min-h-[calc(100vh-2rem)] lg:min-h-[720px] lg:grid-cols-2">
          <div className="hidden lg:flex items-center justify-center p-8 xl:p-10 bg-white">
            <div className="max-w-md text-left">
              <h1 className="text-5xl font-bold text-blue-700 leading-tight mb-6">
                Reset your password
              </h1>
              <p className="text-gray-600 text-lg leading-8">
                We’ll email you a secure reset link so you can choose a new password.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-[#f8faff] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="absolute right-0 bottom-0 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-blue-200/60 blur-3xl pointer-events-none" />
            <div className="relative z-10 w-full max-w-sm sm:max-w-md">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">
                  SkillMatch
                </h2>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Forgot password
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Enter your email and we’ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition ${
                    isDisabled ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                {feedback.message && (
                  <p
                    className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
                      feedback.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {feedback.message}
                  </p>
                )}
              </form>

              <p className="mt-5 text-center text-sm text-gray-600">
                Back to{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
