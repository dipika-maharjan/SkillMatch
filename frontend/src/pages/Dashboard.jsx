import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">
              SkillMatch
            </p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.4fr_0.9fr] lg:gap-8 lg:py-8">
          <section className="rounded-2xl bg-slate-50 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {user?.fullname || user?.name || "User"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Your SkillMatch account is active. Use this dashboard to explore jobs, manage your profile,
              and continue with your application journey.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Edit account
              </Link>
              <Link
                to="/forgot-password"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Reset password
              </Link>
            </div>
          </section>

          <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-gray-500">Account Email</p>
              <p className="mt-2 break-all text-base font-semibold text-gray-900">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-gray-500">Status</p>
              <p className="mt-2 text-base font-semibold text-emerald-600">
                Logged in
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 sm:col-span-2 lg:col-span-1">
              <p className="text-sm font-semibold text-gray-500">Next step</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Continue building your profile and job preferences to improve recommendations.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
