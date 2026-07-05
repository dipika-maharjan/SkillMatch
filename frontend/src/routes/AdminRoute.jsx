import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = Boolean(token && storedUser?.role === "admin");

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
