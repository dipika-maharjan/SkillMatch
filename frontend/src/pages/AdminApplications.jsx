import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import ApplicationDetailModal from "../components/admin/ApplicationDetailModal";

export default function AdminApplications() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await api.get("/admin/applications");
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchApplications, 0);
    return () => window.clearTimeout(timer);
  }, [fetchApplications]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/admin/applications/${applicationId}`, {
        status: newStatus,
      });
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Failed to update application status");
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await api.delete(`/admin/applications/${applicationId}`);
        setApplications(applications.filter((a) => a._id !== applicationId));
      } catch (error) {
        console.error("Failed to delete application:", error);
        alert("Failed to delete application");
      }
    }
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800";
      case "Rejected":
        return "bg-rose-100 text-rose-800";
      case "Reviewed":
        return "bg-sky-100 text-sky-800";
      case "Interview":
        return "bg-violet-100 text-violet-800";
      case "Applied":
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <AdminLayout
      user={user}
      title="Applications"
      description="Review candidates, inspect application details, and update hiring status."
    >
      <div className="mb-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search candidate or job"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-11 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">All status</option>
            <option value="Applied">Applied</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500 shadow-sm">
          Loading applications...
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-zinc-200 bg-zinc-100/70">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Candidate
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Job
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Update Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-zinc-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-zinc-950">
                          {app.candidateName}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {app.candidateEmail}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-600">
                        {app.jobTitle}
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Applied",
                            "Reviewed",
                            "Interview",
                            "Rejected",
                            "Accepted",
                          ].map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleStatusChange(app._id, status)
                              }
                              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize transition ${
                                app.status === status
                                  ? getStatusColor(status)
                                  : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewApplication(app)}
                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(app._id)}
                            className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-sm text-zinc-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ApplicationDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        application={selectedApplication}
        onStatusChange={handleStatusChange}
      />
    </AdminLayout>
  );
}
