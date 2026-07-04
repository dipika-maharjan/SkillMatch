import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/login.png";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true" && Boolean(localStorage.getItem("email"));
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState(() => ({
    email: localStorage.getItem("rememberMe") === "true" ? localStorage.getItem("email") || "" : "",
    password: "",
  }));
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!feedback.message) return;

    const timer = setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [feedback]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setFeedback({ type: "error", message: "Please fill all fields." });
      return;
    }

    if (!emailPattern.test(formData.email.trim())) {
      setFeedback({ type: "error", message: "Enter a valid email address." });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const res = await API.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", formData.email.trim().toLowerCase());
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      setFeedback({
        type: "success",
        message: "Login successful. Redirecting...",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (error) {
      const errorMessage =
        error.response?.status === 401
          ? "Invalid email or password"
          : error.response?.data?.message || "Something went wrong";
      setFeedback({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh overflow-hidden bg-slate-100 flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
      <div className="h-full w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-3xl">

        <div className="grid h-full min-h-0 lg:grid-cols-2">

          {/* Left Section */}
          <div className="hidden min-h-0 lg:flex items-center justify-center p-6 xl:p-8">
            <img
              src={login}
              alt="Login illustration"
              className="h-auto max-h-[calc(100dvh-6rem)] w-full max-w-[540px] object-contain xl:max-w-[600px]"
            />
          </div>

          {/* Right Section */}
          <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-[#f8faff] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

            {/* Blur Background */}
            <div className="absolute right-0 bottom-0 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-blue-200/60 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm sm:max-w-md">

              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">
                  SkillMatch
                </h2>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Welcome back
                </h3>

                <p className="text-sm sm:text-base text-gray-600">
                  Please enter your details to sign in.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    aria-label="Email input"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    aria-label="Password input"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 pr-10 bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.email.trim() || !formData.password.trim()}
                  className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-4 sm:mt-6 shadow-sm ${loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800"
                    }`}
                >
                  {loading
                    ? "Signing in..."
                    : "Sign In"}
                </button>

                {feedback.message && (
                  <p
                    className={`rounded-lg border px-4 py-3 text-sm leading-6 ${feedback.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                  >
                    {feedback.message}
                  </p>
                )}
              </form>

              {/* Register Link */}
              <p className="text-center text-sm sm:text-base text-gray-600 mt-4 sm:mt-5">
                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Register now
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
