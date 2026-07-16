import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import JobFormModal from "../components/admin/JobFormModal";

export default function AdminJobs() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalState, setModalState] = useState({
    type: null,
    title: "",
    message: "",
    job: null,
  });

  const fetchJobs = useCallback(async () => {
    try {
      const response = await api.get("/admin/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchJobs, 0);
    return () => window.clearTimeout(timer);
  }, [fetchJobs]);

  const openDeleteConfirmation = (job) => {
    setModalState({
      type: "delete-confirm",
      title: "Delete job?",
      message: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
      job,
    });
  };

  const handleDeleteJob = async () => {
    const jobToDelete = modalState.job;
    if (!jobToDelete) return;

    try {
      await api.delete(`/admin/jobs/${jobToDelete._id}`);
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== jobToDelete._id),
      );
      setModalState({
        type: "success",
        title: "Job deleted",
        message: "Job deleted successfully.",
        job: null,
      });
    } catch (error) {
      console.error("Failed to delete job:", error);
      setModalState({
        type: "success",
        title: "Delete failed",
        message: "Failed to delete job. Please try again.",
        job: null,
      });
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setShowModal(true);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (selectedJob) {
        await api.put(`/admin/jobs/${selectedJob._id}`, jobData);
      } else {
        await api.post("/admin/jobs", jobData);
      }
      setShowModal(false);
      setSelectedJob(null);
      await fetchJobs();
      setModalState({
        type: "success",
        title: selectedJob ? "Job updated" : "Job created",
        message: selectedJob
          ? "Job updated successfully."
          : "Job created successfully.",
        job: null,
      });
    } catch (error) {
      console.error("Failed to save job:", error);
      setModalState({
        type: "success",
        title: "Action failed",
        message: "Failed to save job. Please try again.",
        job: null,
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getRequirements = (job) =>
    job.skills?.filter(Boolean).slice(0, 3) || [];

  return (
    <AdminLayout
      user={user}
      title="Jobs"
      description="Manage job postings, keep status fresh, and make open roles easy to audit."
      actions={
        <button
          onClick={handleAddJob}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Add Job
        </button>
      }
    >
      <div className="mb-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search title or company"
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
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500 shadow-sm">
          Loading jobs...
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead className="border-b border-zinc-200 bg-zinc-100/70">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Job
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Description
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Requirements
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Company
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Applications
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job._id} className="align-top hover:bg-zinc-50">
                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          {job.jobImage ? (
                            <img
                              src={job.jobImage}
                              alt={job.title}
                              className="h-14 w-20 rounded-md border border-zinc-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-20 items-center justify-center rounded-md border border-zinc-200 bg-teal-50 text-sm font-semibold text-teal-800">
                              {job.title?.charAt(0) || "J"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-zinc-950">
                              {job.title}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {job.location || "Remote"} {" | "}{" "}
                              {job.workType || "Remote"} {" | "}{" "}
                              {job.experienceLevel || "Junior"}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {job.category || "General"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-sm px-5 py-4 text-sm leading-6 text-zinc-600">
                        <p className="line-clamp-3">
                          {job.description || "No description added."}
                        </p>
                      </td>
                      <td className="max-w-xs px-5 py-4">
                        {getRequirements(job).length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {getRequirements(job).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills?.length > 3 && (
                              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                                +{job.skills.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-500">
                            No requirements
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="h-10 w-10 rounded-md border border-zinc-200 object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-sm font-semibold text-zinc-700">
                              {job.company?.charAt(0) || "C"}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-zinc-950">
                              {job.company}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {job.companySize || "Size not set"}
                            </p>
                            <Link
                              to={`/company/${encodeURIComponent(job.company)}`}
                              className="mt-1 inline-block text-xs font-semibold text-teal-700 hover:text-teal-800"
                            >
                              Company profile
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${job.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : job.status === "expired"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-600">
                        {job.applications || 0}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditJob(job)}
                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirmation(job)}
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
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm text-zinc-500"
                    >
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalState.type && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {modalState.type === "delete-confirm" ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950">
                    {modalState.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {modalState.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setModalState({
                    type: null,
                    title: "",
                    message: "",
                    job: null,
                  })
                }
                className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              {modalState.type === "delete-confirm" ? (
                <>
                  <button
                    onClick={() =>
                      setModalState({
                        type: null,
                        title: "",
                        message: "",
                        job: null,
                      })
                    }
                    className="flex-1 rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDeleteJob}
                    className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    Yes, Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    setModalState({
                      type: null,
                      title: "",
                      message: "",
                      job: null,
                    })
                  }
                  className="flex-1 rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <JobFormModal
        key={selectedJob?._id || "new-job"}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveJob}
        initialData={selectedJob}
      />
    </AdminLayout>
  );
}
