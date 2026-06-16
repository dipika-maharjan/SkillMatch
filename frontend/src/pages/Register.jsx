import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import register from "../assets/register.png";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      setFeedback({ type: "error", message: "Please fill all fields." });
      return;
    }

    if (formData.password.length < 8) {
      setFeedback({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    if (!agreedToTerms) {
      setFeedback({
        type: "error",
        message: "Please agree to the Terms of Service and Privacy Policy.",
      });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const res = await API.post("/auth/register", {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user info (optional but useful)
      localStorage.setItem("user", JSON.stringify(res.data));

      setFeedback({
        type: "success",
        message: "Registration successful. Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 900);

    } catch (error) {
      const serverMessage = error.response?.data?.message || "";
      const duplicateAccount =
        serverMessage.toLowerCase().includes("already exists") ||
        error.response?.status === 400;

      setFeedback({
        type: "error",
        message: duplicateAccount
          ? "Account already exists"
          : serverMessage || "Something went wrong",
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
              src={register}
              alt="Registration illustration"
              className="h-auto max-h-[calc(100dvh-6rem)] w-full max-w-[540px] object-contain xl:max-w-[600px]"
            />
          </div>

          {/* Right Section */}
          <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-[#f8faff] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">

            {/* Blur Background */}
            <div className="absolute right-0 bottom-0 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-blue-200/60 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm sm:max-w-md">

              {/* Header */}
              <div className="mb-3 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">
                  SkillMatch
                </h2>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-3">
                  Create your account
                </h3>

                <p className="text-sm sm:text-base text-gray-600">
                  Join the community of future industry leaders.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">

                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 pr-10 bg-white"
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

                <p className="text-xs sm:text-sm text-gray-500">
                  Enter at least 8 characters
                </p>

                {/* Terms */}
                <div className="flex items-start gap-3 py-1 sm:py-2">

                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) =>
                      setAgreedToTerms(e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs sm:text-sm text-gray-600 leading-5"
                  >
                    I agree to the{" "}

                    <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                      Terms of Service
                    </span>

                    {" and "}

                    <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 mt-2 shadow-sm sm:py-3 sm:mt-4 ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-700"
                  }`}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
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

              {/* Login Link */}
              <p className="text-center text-sm sm:text-base text-gray-600 mt-2 sm:mt-5">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
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
