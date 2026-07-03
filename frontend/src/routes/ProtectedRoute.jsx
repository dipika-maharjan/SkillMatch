import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

export default function ProtectedRoute({ children }) {
	const token = localStorage.getItem("token");
	const [status, setStatus] = useState("checking");

	useEffect(() => {
		const verifyToken = async () => {
			if (!token || token === "null" || token === "undefined") {
				setStatus("unauthenticated");
				return;
			}

			try {
				await API.get("/auth/profile");
				setStatus("authenticated");
			} catch {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStatus("unauthenticated");
			}
		};

		verifyToken();
	}, [token]);

	if (status === "checking") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
				<div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-gray-700 shadow-sm">
					Verifying session...
				</div>
			</div>
		);
	}

	if (status === "unauthenticated") {
		return <Navigate to="/login" replace />;
	}

	return children;
}
