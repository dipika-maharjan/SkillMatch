import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
	const { token } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState({ type: "", message: "" });

	useEffect(() => {
		if (!feedback.message) return;

		const timer = setTimeout(() => {
			setFeedback({ type: "", message: "" });
		}, 4000);

		return () => clearTimeout(timer);
	}, [feedback]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!password.trim() || !confirmPassword.trim()) {
			setFeedback({ type: "error", message: "Please fill all fields." });
			return;
		}

		if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
			setFeedback({
				type: "error",
				message: "Password must be strong (A-Z, a-z, 0-9).",
			});
			return;
		}

		if (password !== confirmPassword) {
			setFeedback({ type: "error", message: "Passwords do not match." });
			return;
		}

		try {
			setLoading(true);
			setFeedback({ type: "", message: "" });

			const res = await API.put(`/auth/reset-password/${token}`, {
				password,
			});

			setFeedback({
				type: "success",
				message: res.data?.message || "Password reset successful. Redirecting to login...",
			});

			setTimeout(() => {
				navigate("/login");
			}, 1000);
		} catch (error) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "Something went wrong",
			});
		} finally {
			setLoading(false);
		}
	};

	const isDisabled = loading || !password.trim() || !confirmPassword.trim();

	return (
		<div className="h-dvh overflow-hidden bg-slate-100 flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
			<div className="h-full w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-3xl">
				<div className="grid h-full min-h-0 lg:grid-cols-2">
					<div className="hidden min-h-0 lg:flex items-center justify-center p-6 xl:p-8 bg-white">
						<div className="max-w-md text-left">
							<h1 className="text-4xl font-bold text-blue-700 leading-tight mb-5 xl:text-5xl xl:mb-6">
								Set a new password
							</h1>
							<p className="text-gray-600 text-lg leading-8">
								Choose a strong password for your SkillMatch account and get back in quickly.
							</p>
						</div>
					</div>

					<div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-[#f8faff] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
						<div className="absolute right-0 bottom-0 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-blue-200/60 blur-3xl pointer-events-none" />
						<div className="relative z-10 w-full max-w-sm sm:max-w-md">
							<div className="mb-4 sm:mb-6">
								<h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">SkillMatch</h2>
								<h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
									Reset password
								</h3>
								<p className="text-sm sm:text-base text-gray-600">
									Enter a strong password with uppercase, lowercase, and a number.
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="New password"
									autoComplete="new-password"
									disabled={loading}
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>

								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm new password"
									autoComplete="new-password"
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
									{loading ? "Updating..." : "Reset Password"}
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

							<p className="mt-4 sm:mt-5 text-center text-sm text-gray-600">
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
